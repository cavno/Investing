"""
富途期权最大痛点计算器 - 最终版
已修复所有已知问题
"""

import win32com.client
import pandas as pd
import numpy as np
from futu import OpenQuoteContext, Market, OptionType
from datetime import datetime
import time
import os

FUTU_HOST = '127.0.0.1'
FUTU_PORT = 11111


def get_option_chain_complete(underlying, expiry_date, market=Market.US):
    """获取完整期权链数据"""
    quote_ctx = OpenQuoteContext(host=FUTU_HOST, port=FUTU_PORT)
    
    try:
        print("正在获取到期日列表...")
        ret, expiry_data = quote_ctx.get_option_expiration_date(underlying)
        if ret != 0:
            raise Exception(f"获取到期日失败: {expiry_data}")
        
        expiry_list = expiry_data['strike_time'].tolist()
        if expiry_date not in expiry_list:
            print(f"\n可用的到期日（前10个）:")
            for date in expiry_list[:10]:
                print(f"  - {date}")
            raise Exception(f"到期日 {expiry_date} 不存在")
        
        print(f"正在获取 {expiry_date} 的期权链...")
        ret, strike_data = quote_ctx.get_option_chain(
            code=underlying,
            start=expiry_date,
            end=expiry_date
        )
        
        if ret != 0:
            raise Exception(f"获取期权链失败: {strike_data}")
        
        if strike_data.empty:
            raise Exception("期权链数据为空")
        
        print(f"✓ 获取到 {len(strike_data)} 条期权链记录")
        
        # 确保option_type字段存在
        if 'option_type' not in strike_data.columns:
            raise Exception("期权链数据缺少option_type字段")
        
        # 获取所有期权代码
        option_list = strike_data['code'].tolist()
        print(f"✓ 总共 {len(option_list)} 个期权合约")
        
        # 分批获取快照数据
        batch_size = 200
        all_snapshots = []
        total_batches = (len(option_list) + batch_size - 1) // batch_size
        
        for i in range(0, len(option_list), batch_size):
            batch = option_list[i:i+batch_size]
            batch_num = i // batch_size + 1
            print(f"正在获取第 {batch_num}/{total_batches} 批期权数据...")
            
            ret, snapshot = quote_ctx.get_market_snapshot(batch)
            if ret == 0 and not snapshot.empty:
                all_snapshots.append(snapshot)
            time.sleep(0.5)
        
        # 合并数据 - 关键修复：以strike_data为主表
        if all_snapshots:
            snapshot_data = pd.concat(all_snapshots, ignore_index=True)
            
            # 保留strike_data的所有列，只补充snapshot中的OI和volume
            snapshot_cols = ['code']
            if 'open_interest' in snapshot_data.columns:
                snapshot_cols.append('open_interest')
            if 'volume' in snapshot_data.columns:
                snapshot_cols.append('volume')
            
            # 使用left join确保保留所有strike_data的行和option_type
            complete_data = strike_data.merge(
                snapshot_data[snapshot_cols],
                on='code',
                how='left',
                suffixes=('', '_snapshot')
            )
            
            # 如果有重复列，使用snapshot的值
            if 'open_interest_snapshot' in complete_data.columns:
                complete_data['open_interest'] = complete_data['open_interest_snapshot']
                complete_data = complete_data.drop('open_interest_snapshot', axis=1)
            
        else:
            print("⚠ 警告：未获取到快照数据，使用基础数据")
            complete_data = strike_data.copy()
        
        # 确保必要的列存在
        if 'open_interest' not in complete_data.columns:
            complete_data['open_interest'] = 0
        if 'volume' not in complete_data.columns:
            complete_data['volume'] = 0
        
        # 填充NaN
        complete_data['open_interest'] = complete_data['open_interest'].fillna(0)
        complete_data['volume'] = complete_data['volume'].fillna(0)
        
        # 验证关键字段
        if 'option_type' not in complete_data.columns:
            raise Exception("数据合并后option_type字段丢失！")
        
        print(f"✓ 最终数据包含 {len(complete_data)} 条记录")
        print(f"✓ 数据列: {complete_data.columns.tolist()}")
        
        # 统计
        call_count = len(complete_data[complete_data['option_type'] == 'CALL'])
        put_count = len(complete_data[complete_data['option_type'] == 'PUT'])
        print(f"✓ Call: {call_count}, Put: {put_count}\n")
        
        return complete_data
        
    except Exception as e:
        raise e
    finally:
        quote_ctx.close()


def calculate_max_pain(option_data):
    """计算最大痛点"""
    print("开始计算最大痛点...")
    print("="*70)
    
    # 验证必要字段
    required_fields = ['strike_price', 'option_type', 'open_interest']
    missing = [f for f in required_fields if f not in option_data.columns]
    if missing:
        raise Exception(f"数据缺少必要字段: {missing}")
    
    strikes = sorted(option_data['strike_price'].unique())
    print(f"行权价数量: {len(strikes)}")
    
    results = []
    
    for price_point in strikes:
        call_loss = 0
        put_loss = 0
        
        for _, option in option_data.iterrows():
            strike = option['strike_price']
            option_type = option['option_type']
            
            oi = option.get('open_interest', 0)
            if pd.isna(oi) or oi == 0:
                oi = option.get('volume', 0)
            
            if pd.isna(oi):
                oi = 0
            
            if option_type == 'CALL':
                intrinsic = max(0, price_point - strike)
                call_loss += intrinsic * oi
            elif option_type == 'PUT':
                intrinsic = max(0, strike - price_point)
                put_loss += intrinsic * oi
        
        total_loss = call_loss + put_loss
        
        results.append({
            'strike': price_point,
            'call_loss': call_loss,
            'put_loss': put_loss,
            'total_loss': total_loss
        })
    
    results_df = pd.DataFrame(results)
    
    # 修正：最大痛点应该是total_loss的最小值（期权持有者损失最大 = 内在价值最小）
    min_idx = results_df['total_loss'].idxmin()
    max_pain = results_df.loc[min_idx, 'strike']
    min_loss = results_df.loc[min_idx, 'total_loss']
    
    # 显示total_loss最小的10个行权价（最大痛点附近）
    top_10 = results_df.nsmallest(10, 'total_loss')
    
    print("内在价值最小的10个行权价（最大痛点附近）:")
    print("-" * 70)
    print(f"{'行权价':<12} {'Call价值':<18} {'Put价值':<18} {'总价值':<18}")
    print("-" * 70)
    
    for _, row in top_10.iterrows():
        marker = " <<< 最大痛点" if row['strike'] == max_pain else ""
        print(f"${row['strike']:<11.2f} ${row['call_loss']:>16,.0f} ${row['put_loss']:>16,.0f} ${row['total_loss']:>16,.0f}{marker}")
    
    print("-" * 70)
    print(f"\n>>> 最大痛点: ${max_pain:.2f}")
    print(f">>> 该点期权总内在价值: ${min_loss:,.0f}")
    print(f"\n说明：最大痛点是使期权持有者总内在价值最小的价格")
    print(f"      即做市商在此价格支付给期权持有者的金额最少")
    print(f"\n{'='*70}\n")
    
    return max_pain, results_df


def convert_to_excel_safe_value(value):
    """将值转换为Excel安全的格式"""
    if value is None or pd.isna(value):
        return ""
    
    if isinstance(value, (np.integer, np.int64, np.int32)):
        return int(value)
    
    if isinstance(value, (np.floating, np.float64, np.float32)):
        if np.isnan(value) or np.isinf(value):
            return ""
        return float(value)
    
    if isinstance(value, bool):
        return str(value)
    
    if isinstance(value, (int, float)):
        try:
            if np.isinf(value):
                return ""
        except:
            pass
        return value
    
    if isinstance(value, str):
        if len(value) > 32000:
            return value[:32000] + "..."
        return value
    
    if isinstance(value, (datetime, pd.Timestamp)):
        return value.strftime('%Y-%m-%d %H:%M:%S')
    
    if isinstance(value, (list, dict, tuple, set)):
        return str(value)[:1000]
    
    try:
        return str(value)[:1000]
    except:
        return ""


def write_to_excel(sheet, df, start_row=1, start_col=1):
    """将DataFrame写入Excel - 完全防错版本"""
    sheet.Cells.Clear()
    
    if df.empty:
        print("  数据为空，跳过写入")
        return
    
    print(f"  准备写入 {len(df)} 行 x {len(df.columns)} 列数据...")
    
    # 安全处理列名
    safe_columns = []
    for col in df.columns:
        try:
            col_str = str(col)
            if not col_str or col_str == 'nan':
                col_str = f"Column_{len(safe_columns)}"
            safe_columns.append(col_str)
        except:
            safe_columns.append(f"Column_{len(safe_columns)}")
    
    # 写入表头
    for i, col in enumerate(safe_columns, start_col):
        try:
            sheet.Cells(start_row, i).Value = col
        except:
            sheet.Cells(start_row, i).Value = f"Col{i}"
    
    # 写入数据
    total_rows = min(len(df), 10000)
    if len(df) > total_rows:
        print(f"  注意：数据超过{total_rows}行，仅写入前{total_rows}行")
    
    error_count = 0
    
    for idx in range(total_rows):
        row_num = start_row + 1 + idx
        row = df.iloc[idx]
        
        for j, value in enumerate(row, start_col):
            try:
                safe_value = convert_to_excel_safe_value(value)
                sheet.Cells(row_num, j).Value = safe_value
            except Exception as e:
                sheet.Cells(row_num, j).Value = ""
                error_count += 1
                if error_count <= 3:
                    print(f"  警告：第{row_num}行第{j}列写入失败")
        
        if (idx + 1) % 500 == 0 or (idx + 1) == total_rows:
            print(f"  已写入 {idx+1}/{total_rows} 行...")
    
    if error_count > 0:
        print(f"  ⚠ 共有 {error_count} 个单元格写入失败（已置空）")
    
    print(f"  ✓ 写入完成")


def main():
    """主函数"""
    print("="*70)
    print("富途期权最大痛点计算器")
    print("="*70)
    print("\n正在连接Excel...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    excel_file = os.path.join(script_dir, "期权最大痛点.xlsm")
    
    if not os.path.exists(excel_file):
        print(f"\n✗ 错误：找不到Excel文件")
        input("\n按回车键退出...")
        return
    
    try:
        excel = win32com.client.GetActiveObject("Excel.Application")
    except:
        print("启动Excel...")
        excel = win32com.client.Dispatch("Excel.Application")
        excel.Visible = True
    
    try:
        wb = None
        for workbook in excel.Workbooks:
            if workbook.FullName == excel_file:
                wb = workbook
                break
        
        if wb is None:
            wb = excel.Workbooks.Open(excel_file)
        
        wb.Activate()
        print(f"✓ 已连接到工作簿: {wb.Name}\n")
        
        if wb.Worksheets.Count < 3:
            print("✗ 错误：工作表数量不足")
            input("\n按回车键退出...")
            return
        
        control_sheet = wb.Worksheets(1)
        data_sheet = wb.Worksheets(2)
        pain_sheet = wb.Worksheets(3)
        
        # 读取参数
        underlying = control_sheet.Range("B1").Value
        expiry_date = control_sheet.Range("B2").Value
        market_str = control_sheet.Range("B3").Value
        
        if not market_str:
            market_str = "US"
        
        print("输入参数:")
        print(f"  标的代码: {underlying}")
        print(f"  到期日: {expiry_date}")
        print(f"  市场: {market_str}")
        
        if not underlying or not expiry_date:
            error_msg = "错误：请填写标的代码和到期日"
            control_sheet.Range("B5").Value = error_msg
            print(f"\n✗ {error_msg}")
            input("\n按回车键退出...")
            return
        
        # 日期格式转换
        if isinstance(expiry_date, datetime):
            expiry_date = expiry_date.strftime('%Y-%m-%d')
        else:
            expiry_date = str(expiry_date).strip()
            if ' ' in expiry_date:
                expiry_date = expiry_date.split(' ')[0]
        
        market = Market.US if market_str.upper() == "US" else Market.HK
        
        # 自动添加市场前缀
        if '.' not in str(underlying):
            underlying = market_str.upper() + '.' + str(underlying)
        
        print(f"  完整代码: {underlying}\n")
        
        control_sheet.Range("B5").Value = "正在获取期权链..."
        
        # 获取数据
        option_data = get_option_chain_complete(underlying, expiry_date, market)
        
        # 计算最大痛点
        control_sheet.Range("B5").Value = "正在计算最大痛点..."
        max_pain, pain_detail = calculate_max_pain(option_data)
        
        # 写入结果
        control_sheet.Range("B4").Value = max_pain
        control_sheet.Range("B5").Value = f"完成！最大痛点: ${max_pain}"
        
        print("="*70)
        print(f"最大痛点价格: ${max_pain}")
        print("="*70)
        
        # 写入期权数据
        print("\n正在写入期权数据到Excel...")
        write_to_excel(data_sheet, option_data.head(1000))
        
        # 写入痛点分析
        print("正在写入痛点分析到Excel...")
        write_to_excel(pain_sheet, pain_detail)
        
        print("\n" + "="*70)
        print("✓ 所有任务完成！")
        print("="*70)
        
    except Exception as e:
        print(f"\n✗ 错误: {e}")
        print("\n详细错误信息:")
        import traceback
        traceback.print_exc()
        
        try:
            if 'control_sheet' in locals():
                control_sheet.Range("B5").Value = f"错误: {str(e)[:100]}"
        except:
            pass
    
    input("\n按任意键退出...")


if __name__ == "__main__":
    main()