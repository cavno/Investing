"""
IB Gateway 专用期权链获取工具
针对 IB Gateway 优化的版本
"""

from ib_insync import *
import pandas as pd
from datetime import datetime


class IBGatewayOptions:
    """IB Gateway 专用期权链客户端"""
    
    def __init__(self, host='127.0.0.1', port=4002, client_id=1):
        """
        初始化连接到 IB Gateway
        
        参数:
            host: 主机地址（默认 127.0.0.1）
            port: IB Gateway 端口
                  Paper Trading: 4002 (默认)
                  Live Trading: 4001
            client_id: 客户端ID（默认 1）
        """
        self.ib = IB()
        self.host = host
        self.port = port
        self.client_id = client_id
        self.connected = False
        
        print(f"\n{'='*70}")
        print(f"IB Gateway 期权链获取工具")
        print(f"{'='*70}")
        print(f"\n连接配置:")
        print(f"  主机: {host}")
        print(f"  端口: {port}")
        
        if port == 4002:
            print(f"  账户类型: Paper Trading (模拟)")
        elif port == 4001:
            print(f"  账户类型: Live Trading (实盘)")
        else:
            print(f"  ⚠️  非标准端口（Gateway标准端口: 4002/4001）")
        
    def connect(self):
        """连接到 IB Gateway"""
        print(f"\n正在连接到 IB Gateway...")
        
        try:
            self.ib.connect(
                self.host,
                self.port,
                clientId=self.client_id,
                timeout=10
            )
            
            self.connected = True
            print(f"✅ 成功连接到 IB Gateway")
            print(f"   连接状态: {self.ib.isConnected()}")
            
            # 获取账户信息
            try:
                accounts = self.ib.managedAccounts()
                if accounts:
                    print(f"   账户列表: {accounts}")
                    
                # 获取服务器时间
                server_time = self.ib.reqCurrentTime()
                print(f"   服务器时间: {server_time}")
                
            except Exception as e:
                print(f"   ⚠️  获取账户信息失败: {e}")
            
            return True
            
        except ConnectionRefusedError:
            self.connected = False
            print(f"\n❌ 连接被拒绝")
            print(f"\n【问题】IB Gateway 的 API 未启用")
            print(f"\n【解决方案】")
            print(f"1. 在 IB Gateway 中，点击右上角 'Configure' 按钮（齿轮图标）")
            print(f"2. 找到 API Settings")
            print(f"3. 勾选: ☑ Enable ActiveX and Socket Clients")
            print(f"4. 在 'Trusted IP Addresses' 中添加: 127.0.0.1")
            print(f"5. 点击 OK 保存（Gateway 不需要重启）")
            print(f"\n详细指南: 查看 GATEWAY_GUIDE.md")
            return False
            
        except (TimeoutError, OSError) as e:
            self.connected = False
            print(f"\n❌ 连接超时或端口错误")
            print(f"\n【可能原因】")
            print(f"1. IB Gateway 没有运行")
            print(f"2. 端口号不正确")
            print(f"   - Paper Trading 应使用: 4002")
            print(f"   - Live Trading 应使用: 4001")
            print(f"3. IB Gateway 正在启动中")
            print(f"\n【解决方案】")
            print(f"1. 确认 IB Gateway 已完全启动")
            print(f"2. 检查窗口是否显示绿色连接状态")
            print(f"3. 确认使用正确的端口号")
            print(f"\n当前使用端口: {self.port}")
            return False
            
        except Exception as e:
            self.connected = False
            print(f"\n❌ 连接失败: {e}")
            print(f"\n【建议】运行诊断工具:")
            print(f"  python diagnose_gateway.py")
            return False
    
    def disconnect(self):
        """断开连接"""
        if self.connected:
            self.ib.disconnect()
            self.connected = False
            print(f"\n✅ 已断开 IB Gateway 连接")
    
    def get_options_chain(self, symbol, exchange='SMART', currency='USD',
                         expiration=None, num_strikes=20):
        """
        获取期权链
        
        参数:
            symbol: 标的代码（如 'AAPL'）
            exchange: 交易所（默认 'SMART'）
            currency: 货币（默认 'USD'）
            expiration: 到期日（YYYYMMDD 格式）
            num_strikes: 获取的行权价数量
        """
        print(f"\n{'='*70}")
        print(f"获取 {symbol} 期权链")
        print(f"{'='*70}")
        
        # 1. 获取标的合约
        print(f"\n步骤 1/6: 验证标的合约...")
        try:
            stock = Stock(symbol, exchange, currency)
            qualified = self.ib.qualifyContracts(stock)
            
            if not qualified:
                print(f"❌ 无法找到标的: {symbol}")
                return None, None
            
            stock = qualified[0]
            print(f"✅ 标的: {stock.symbol}")
            print(f"   交易所: {stock.primaryExchange or stock.exchange}")
            print(f"   合约ID: {stock.conId}")
            
        except Exception as e:
            print(f"❌ 查询标的失败: {e}")
            return None, None
        
        # 2. 获取期权链参数
        print(f"\n步骤 2/6: 查询期权链参数...")
        try:
            chains = self.ib.reqSecDefOptParams(
                stock.symbol, '', stock.secType, stock.conId
            )
            
            if not chains:
                print(f"❌ 未找到期权链")
                return None, None
            
            chain = chains[0]
            print(f"✅ 期权交易所: {chain.exchange}")
            print(f"   乘数: {chain.multiplier}")
            
        except Exception as e:
            print(f"❌ 查询期权链失败: {e}")
            return None, None
        
        # 3. 选择到期日
        print(f"\n步骤 3/6: 选择到期日...")
        available_expirations = sorted(chain.expirations)
        
        print(f"✅ 可用到期日数量: {len(available_expirations)}")
        if len(available_expirations) <= 10:
            print(f"   所有到期日: {available_expirations}")
        else:
            print(f"   最近10个: {available_expirations[:10]}")
        
        if expiration is None:
            expiration = available_expirations[0]
            print(f"   自动选择: {expiration}")
        elif expiration in available_expirations:
            print(f"   使用指定: {expiration}")
        else:
            print(f"   ⚠️  {expiration} 不可用")
            expiration = available_expirations[0]
            print(f"   改用: {expiration}")
        
        # 4. 选择行权价
        print(f"\n步骤 4/6: 筛选行权价...")
        all_strikes = sorted(chain.strikes)
        
        print(f"✅ 总行权价数量: {len(all_strikes)}")
        print(f"   范围: ${min(all_strikes):.2f} - ${max(all_strikes):.2f}")
        
        # 选择中间部分的行权价
        mid_idx = len(all_strikes) // 2
        half = num_strikes // 2
        start = max(0, mid_idx - half)
        end = min(len(all_strikes), mid_idx + half)
        strikes = all_strikes[start:end]
        
        print(f"✅ 选择 {len(strikes)} 个行权价")
        print(f"   范围: ${min(strikes):.2f} - ${max(strikes):.2f}")
        
        # 5. 构建期权合约
        print(f"\n步骤 5/6: 构建期权合约...")
        contracts = []
        
        for strike in strikes:
            # 看涨期权
            call = Option(
                symbol=symbol,
                lastTradeDateOrContractMonth=expiration,
                strike=strike,
                right='C',
                exchange=chain.exchange
            )
            contracts.append(call)
            
            # 看跌期权
            put = Option(
                symbol=symbol,
                lastTradeDateOrContractMonth=expiration,
                strike=strike,
                right='P',
                exchange=chain.exchange
            )
            contracts.append(put)
        
        print(f"✅ 构建了 {len(contracts)} 个期权合约")
        print(f"   看涨: {len(strikes)} 个")
        print(f"   看跌: {len(strikes)} 个")
        
        # 6. 验证合约
        print(f"\n步骤 6/6: 验证合约...")
        qualified_contracts = []
        failed = 0
        
        batch_size = 10
        total = len(contracts)
        
        for i in range(0, total, batch_size):
            batch = contracts[i:i+batch_size]
            
            try:
                qualified_batch = self.ib.qualifyContracts(*batch)
                qualified_contracts.extend(qualified_batch)
            except:
                # 单个验证
                for contract in batch:
                    try:
                        q = self.ib.qualifyContracts(contract)
                        if q:
                            qualified_contracts.extend(q)
                        else:
                            failed += 1
                    except:
                        failed += 1
            
            # 显示进度
            progress = min(i + batch_size, total)
            pct = progress * 100 // total
            print(f"   进度: {progress}/{total} ({pct}%)", end='\r')
        
        print(f"\n✅ 验证完成!")
        print(f"   成功: {len(qualified_contracts)} 个")
        if failed > 0:
            print(f"   失败: {failed} 个")
        
        # 整理信息
        chain_info = {
            'symbol': symbol,
            'exchange': chain.exchange,
            'expiration': expiration,
            'strikes': strikes,
            'num_contracts': len(qualified_contracts)
        }
        
        return qualified_contracts, chain_info
    
    def get_contract_details(self, contracts):
        """整理合约详细信息"""
        if not contracts:
            return pd.DataFrame()
        
        print(f"\n整理合约详细信息...")
        
        data = []
        for contract in contracts:
            data.append({
                '标的': contract.symbol,
                '到期日': contract.lastTradeDateOrContractMonth,
                '行权价': contract.strike,
                '类型': '看涨' if contract.right == 'C' else '看跌',
                '交易所': contract.exchange,
                '合约ID': contract.conId,
                '本地代码': contract.localSymbol,
                '乘数': contract.multiplier,
                '货币': contract.currency
            })
        
        df = pd.DataFrame(data)
        df = df.sort_values(['类型', '行权价']).reset_index(drop=True)
        
        print(f"✅ 整理完成")
        return df


def main():
    """主函数"""
    print(f"\n" + "="*70)
    print(f"IB Gateway 期权链获取工具")
    print(f"="*70)
    
    # 连接参数
    # Paper Trading 使用端口 4002
    # Live Trading 使用端口 4001
    
    client = IBGatewayOptions(
        host='127.0.0.1',
        port=4002,  # Paper Trading 端口
        client_id=1
    )
    
    # 连接
    if not client.connect():
        print(f"\n无法连接到 IB Gateway")
        print(f"\n请检查:")
        print(f"1. IB Gateway 是否正在运行?")
        print(f"2. 是否已登录账户?")
        print(f"3. API 设置是否正确? (Configure → API Settings)")
        print(f"\n详细配置指南: GATEWAY_GUIDE.md")
        print(f"运行诊断工具: python diagnose_gateway.py")
        return
    
    try:
        # 参数配置
        symbol = 'AAPL'       # 标的代码
        expiration = None      # None = 最近到期日
        num_strikes = 20       # 获取20个行权价
        
        print(f"\n参数配置:")
        print(f"  标的代码: {symbol}")
        print(f"  到期日: {'自动选择最近' if expiration is None else expiration}")
        print(f"  行权价数量: {num_strikes}")
        
        # 获取期权链
        contracts, chain_info = client.get_options_chain(
            symbol=symbol,
            expiration=expiration,
            num_strikes=num_strikes
        )
        
        if not contracts or not chain_info:
            print(f"\n❌ 未能获取期权链")
            return
        
        # 整理数据
        df = client.get_contract_details(contracts)
        
        # 显示统计
        print(f"\n{'='*70}")
        print(f"期权链数据统计")
        print(f"{'='*70}")
        
        calls = df[df['类型'] == '看涨']
        puts = df[df['类型'] == '看跌']
        
        print(f"\n标的: {chain_info['symbol']}")
        print(f"到期日: {chain_info['expiration']}")
        print(f"交易所: {chain_info['exchange']}")
        print(f"\n合约统计:")
        print(f"  总数: {len(df)}")
        print(f"  看涨: {len(calls)}")
        print(f"  看跌: {len(puts)}")
        print(f"\n行权价范围:")
        print(f"  ${df['行权价'].min():.2f} - ${df['行权价'].max():.2f}")
        
        # 显示数据样本
        print(f"\n{'='*70}")
        print(f"数据样本（前 15 行）")
        print(f"{'='*70}\n")
        
        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', None)
        pd.set_option('display.float_format', lambda x: f'{x:.2f}')
        
        display_cols = ['行权价', '类型', '本地代码', '合约ID']
        print(df[display_cols].head(15).to_string(index=False))
        
        # 保存数据
        filename = f"{symbol}_{chain_info['expiration']}_gateway.csv"
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"\n✅ 数据已保存到: {filename}")
        
        # 显示行权价列表
        print(f"\n{'='*70}")
        print(f"完整行权价列表")
        print(f"{'='*70}\n")
        
        strikes = sorted(df['行权价'].unique())
        for i, strike in enumerate(strikes, 1):
            print(f"  {i:2d}. ${strike:.2f}")
        
        print(f"\n{'='*70}")
        print(f"✅ 完成！")
        print(f"{'='*70}\n")
        
    except KeyboardInterrupt:
        print(f"\n\n程序被中断")
        
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        client.disconnect()


if __name__ == '__main__':
    main()
