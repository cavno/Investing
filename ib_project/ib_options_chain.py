"""
盈透证券API - 获取期权链数据
使用ib_insync库来简化与IB API的交互
"""

from ib_insync import *
import pandas as pd
from datetime import datetime


class IBOptionsChain:
    def __init__(self, host='127.0.0.1', port=7496, client_id=1):
        """
        初始化IB连接
        
        参数:
            host: IB网关/TWS的主机地址
            port: 端口号 (TWS: 7497, IB Gateway: 4001, 模拟交易: 7497)
            client_id: 客户端ID
        """
        self.ib = IB()
        self.host = host
        self.port = port
        self.client_id = client_id
        
    def connect(self):
        """连接到IB"""
        try:
            self.ib.connect(self.host, self.port, clientId=self.client_id)
            print(f"成功连接到IB: {self.host}:{self.port}")
            return True
        except Exception as e:
            print(f"连接失败: {e}")
            return False
    
    def disconnect(self):
        """断开IB连接"""
        self.ib.disconnect()
        print("已断开IB连接")
    
    def get_options_chain(self, symbol, exchange='SMART', currency='USD', 
                         expiration=None, strike=None, right=None,
                         strike_range=None, filter_liquid=True):
        """
        获取期权链数据
        
        参数:
            symbol: 标的代码 (如 'AAPL', 'SPY')
            exchange: 交易所 (默认 'SMART')
            currency: 货币 (默认 'USD')
            expiration: 到期日 (格式: 'YYYYMMDD', 如 '20250117')
            strike: 行权价 (可选,用于筛选特定行权价)
            right: 期权类型 ('C' 看涨, 'P' 看跌, None 为全部)
            strike_range: 行权价范围 (元组: (最小值, 最大值))
            filter_liquid: 是否只获取流动性好的行权价 (默认True)
        
        返回:
            list: 合格的期权合约列表
        """
        # 创建标的合约
        stock = Stock(symbol, exchange, currency)
        self.ib.qualifyContracts(stock)
        
        print(f"\n正在获取 {symbol} 的期权链信息...")
        
        # 获取期权链参数
        chains = self.ib.reqSecDefOptParams(
            stock.symbol, '', stock.secType, stock.conId
        )
        
        if not chains:
            print(f"❌ 未找到 {symbol} 的期权链")
            return None
        
        # 选择第一个可用的期权链
        chain = chains[0]
        print(f"✅ 标的: {symbol}")
        print(f"   交易所: {chain.exchange}")
        
        # 显示可用到期日
        available_expirations = sorted(chain.expirations)
        print(f"   可用到期日数量: {len(available_expirations)}")
        print(f"   最近的到期日: {available_expirations[:5]}")
        
        # 如果没有指定到期日,使用最近的一个
        if expiration is None:
            expiration = available_expirations[0]
            print(f"   使用到期日: {expiration}")
        elif expiration not in available_expirations:
            print(f"⚠️  指定的到期日 {expiration} 不可用")
            print(f"   最接近的可用到期日: {available_expirations[0]}")
            expiration = available_expirations[0]
        
        # 获取当前股价（用于筛选合理的行权价）
        try:
            tickers = self.ib.reqTickers(stock)
            self.ib.sleep(1)
            
            if tickers and len(tickers) > 0:
                ticker = tickers[0]
                if ticker.marketPrice():
                    current_price = ticker.marketPrice()
                    print(f"   当前股价: ${current_price:.2f}")
                elif ticker.close == ticker.close:  # 检查close不是NaN
                    current_price = ticker.close
                    print(f"   当前股价: ${current_price:.2f} (使用收盘价)")
                else:
                    current_price = None
                    print(f"   ⚠️  无法获取当前股价，将使用所有行权价")
            else:
                current_price = None
                print(f"   ⚠️  无法获取当前股价，将使用所有行权价")
        except Exception as e:
            current_price = None
            print(f"   ⚠️  获取股价失败: {e}，将使用所有行权价")
        
        # 筛选行权价
        all_strikes = sorted(chain.strikes)
        print(f"   可用行权价数量: {len(all_strikes)}")
        print(f"   行权价范围: ${min(all_strikes):.2f} - ${max(all_strikes):.2f}")
        
        # 应用行权价筛选
        if strike is not None:
            # 指定了特定行权价
            strikes = [s for s in all_strikes if s == strike]
        elif strike_range is not None:
            # 指定了行权价范围
            min_strike, max_strike = strike_range
            strikes = [s for s in all_strikes if min_strike <= s <= max_strike]
        elif filter_liquid and current_price is not None:
            # 自动筛选流动性好的行权价（当前价格的±30%）
            lower_bound = current_price * 0.70
            upper_bound = current_price * 1.30
            strikes = [s for s in all_strikes if lower_bound <= s <= upper_bound]
            print(f"   筛选后行权价数量: {len(strikes)} (当前价±30%)")
        else:
            # 使用所有行权价（可能很多）
            strikes = all_strikes
            print(f"   ⚠️  将获取所有 {len(strikes)} 个行权价的期权（可能较慢）")
        
        if not strikes:
            print(f"❌ 没有符合条件的行权价")
            return None
        
        print(f"   将获取行权价范围: ${min(strikes):.2f} - ${max(strikes):.2f}")
        
        # 构建期权合约
        options = []
        rights = ['C', 'P'] if right is None else [right]
        
        for right_type in rights:
            for strike_price in strikes:
                option = Option(
                    symbol=symbol,
                    lastTradeDateOrContractMonth=expiration,
                    strike=strike_price,
                    right=right_type,
                    exchange=chain.exchange
                )
                options.append(option)
        
        print(f"\n正在验证 {len(options)} 个期权合约...")
        
        # 批量验证合约（分批处理以避免错误）
        batch_size = 50
        qualified = []
        
        for i in range(0, len(options), batch_size):
            batch = options[i:i+batch_size]
            try:
                qualified_batch = self.ib.qualifyContracts(*batch)
                qualified.extend(qualified_batch)
                print(f"   已验证: {len(qualified)}/{len(options)} 个合约", end='\r')
            except Exception as e:
                print(f"\n   ⚠️  批次 {i//batch_size + 1} 验证失败: {e}")
                # 尝试单个验证
                for opt in batch:
                    try:
                        q = self.ib.qualifyContracts(opt)
                        if q:
                            qualified.extend(q)
                    except:
                        pass
        
        print(f"\n✅ 成功验证 {len(qualified)} 个期权合约")
        
        if len(qualified) < len(options):
            print(f"   ⚠️  有 {len(options) - len(qualified)} 个合约无法验证（可能不存在或无效）")
        
        return qualified
    
    def get_market_data(self, contracts, snapshot=True, generic_tick_list=''):
        """
        获取期权合约的市场数据
        
        参数:
            contracts: 期权合约列表
            snapshot: 是否只获取快照 (True) 或实时数据流 (False)
            generic_tick_list: 额外的数据字段 (如 '106' 获取期权隐含波动率)
        
        返回:
            DataFrame包含市场数据
        """
        if not contracts:
            print("❌ 没有合约需要获取数据")
            return pd.DataFrame()
        
        print(f"\n正在获取 {len(contracts)} 个期权的市场数据...")
        
        # 请求市场数据
        tickers = []
        failed_count = 0
        
        for i, contract in enumerate(contracts, 1):
            try:
                ticker = self.ib.reqMktData(
                    contract, 
                    genericTickList=generic_tick_list,
                    snapshot=snapshot, 
                    regulatorySnapshot=False
                )
                tickers.append(ticker)
                
                # 显示进度
                if i % 10 == 0:
                    print(f"   已请求: {i}/{len(contracts)}", end='\r')
                    
            except Exception as e:
                failed_count += 1
                print(f"\n   ⚠️  请求失败 {contract.strike} {contract.right}: {e}")
        
        print(f"\n✅ 成功请求 {len(tickers)} 个合约的数据")
        
        if failed_count > 0:
            print(f"   ⚠️  有 {failed_count} 个请求失败")
        
        # 等待数据
        if snapshot:
            print("   等待快照数据...")
            self.ib.sleep(3)  # 增加等待时间
        
        # 整理数据
        data = []
        valid_count = 0
        
        for ticker in tickers:
            contract = ticker.contract
            
            # 检查是否有有效数据
            has_data = (
                ticker.last == ticker.last or  # last不是NaN
                ticker.close == ticker.close or  # close不是NaN
                ticker.bid == ticker.bid or  # bid不是NaN
                ticker.ask == ticker.ask  # ask不是NaN
            )
            
            if not has_data:
                continue
            
            valid_count += 1
            
            # 获取最新价格
            last_price = ticker.last if ticker.last == ticker.last else ticker.close
            
            # 计算买卖价差
            bid = ticker.bid if ticker.bid == ticker.bid else None
            ask = ticker.ask if ticker.ask == ticker.ask else None
            spread = (ask - bid) if (bid and ask) else None
            
            data.append({
                '标的': contract.symbol,
                '到期日': contract.lastTradeDateOrContractMonth,
                '行权价': contract.strike,
                '类型': '看涨' if contract.right == 'C' else '看跌',
                '最新价': last_price,
                '买价': bid,
                '卖价': ask,
                '买卖价差': spread,
                '买量': ticker.bidSize if ticker.bidSize == ticker.bidSize else None,
                '卖量': ticker.askSize if ticker.askSize == ticker.askSize else None,
                '成交量': ticker.volume if ticker.volume == ticker.volume else None,
                '未平仓量': ticker.openInterest if ticker.openInterest == ticker.openInterest else None,
                '隐含波动率': ticker.impliedVolatility if ticker.impliedVolatility == ticker.impliedVolatility else None,
                '期权价值': ticker.optPrice if ticker.optPrice == ticker.optPrice else None,
                '标的价格': ticker.undPrice if ticker.undPrice == ticker.undPrice else None,
                'Delta': ticker.modelGreeks.delta if ticker.modelGreeks else None,
                'Gamma': ticker.modelGreeks.gamma if ticker.modelGreeks else None,
                'Theta': ticker.modelGreeks.theta if ticker.modelGreeks else None,
                'Vega': ticker.modelGreeks.vega if ticker.modelGreeks else None,
            })
        
        # 取消订阅
        for ticker in tickers:
            self.ib.cancelMktData(ticker.contract)
        
        print(f"✅ 获得 {valid_count} 个期权的有效数据")
        
        if valid_count == 0:
            print("⚠️  警告: 没有获取到有效的市场数据")
            print("   可能原因:")
            print("   1. 市场未开盘")
            print("   2. 需要订阅市场数据")
            print("   3. 这些期权没有交易")
        
        df = pd.DataFrame(data)
        
        # 按行权价排序
        if not df.empty:
            df = df.sort_values(['类型', '行权价'])
        
        return df


def main():
    """示例用法"""
    # 创建客户端
    client = IBOptionsChain(
        host='127.0.0.1',  # 本地主机
        port=7496,          # TWS端口 (模拟: 7497, 实盘: 7496)
        client_id=1
    )
    
    # 连接
    if not client.connect():
        return
    
    try:
        # 获取AAPL期权链
        symbol = 'AAPL'
        expiration = '20251031'  # 2025年1月17日到期
        
        print(f"\n正在获取 {symbol} 的期权链...")
        
        # 方式1: 自动筛选流动性好的期权（推荐）
        contracts = client.get_options_chain(
            symbol=symbol,
            expiration=expiration,
            right=None,  # None=所有, 'C'=看涨, 'P'=看跌
            filter_liquid=True  # 自动筛选流动性好的行权价
        )
        
        # 方式2: 指定行权价范围
        # contracts = client.get_options_chain(
        #     symbol=symbol,
        #     expiration=expiration,
        #     strike_range=(150, 200)  # 只获取150-200之间的行权价
        # )
        
        # 方式3: 获取所有行权价（慎用，可能很多）
        # contracts = client.get_options_chain(
        #     symbol=symbol,
        #     expiration=expiration,
        #     filter_liquid=False  # 获取所有行权价
        # )
        
        if contracts:
            # 获取市场数据
            print("\n正在获取市场数据...")
            df = client.get_market_data(contracts, snapshot=True)
            
            if not df.empty:
                # 显示数据
                print(f"\n期权链数据 ({len(df)} 条):")
                pd.set_option('display.max_columns', None)
                pd.set_option('display.width', None)
                pd.set_option('display.float_format', lambda x: f'{x:.4f}')
                
                # 显示前20条
                print("\n前20条数据:")
                print(df.head(20)[['行权价', '类型', '最新价', '买价', '卖价', 
                                   '成交量', '未平仓量', '隐含波动率']])
                
                # 保存到CSV
                filename = f"{symbol}_{expiration}_options.csv"
                df.to_csv(filename, index=False, encoding='utf-8-sig')
                print(f"\n数据已保存到: {filename}")
                
                # 基本统计
                calls = df[df['类型'] == '看涨']
                puts = df[df['类型'] == '看跌']
                
                print(f"\n基本统计:")
                print(f"  看涨期权: {len(calls)} 个")
                print(f"  看跌期权: {len(puts)} 个")
                
                # 成交量统计
                if not df['成交量'].isna().all():
                    total_volume = df['成交量'].sum()
                    call_volume = calls['成交量'].sum()
                    put_volume = puts['成交量'].sum()
                    
                    print(f"\n成交量统计:")
                    print(f"  总成交量: {total_volume:,.0f}")
                    print(f"  看涨成交量: {call_volume:,.0f}")
                    print(f"  看跌成交量: {put_volume:,.0f}")
                    
                    if call_volume > 0:
                        pcr = put_volume / call_volume
                        print(f"  P/C比率: {pcr:.2f}")
                    
                    print(f"\n成交量最大的5个期权:")
                    top_volume = df.nlargest(5, '成交量')
                    print(top_volume[['行权价', '类型', '成交量', '最新价', '未平仓量']])
                
                # 未平仓量统计
                if not df['未平仓量'].isna().all():
                    print(f"\n未平仓量最大的5个期权:")
                    top_oi = df.nlargest(5, '未平仓量')
                    print(top_oi[['行权价', '类型', '未平仓量', '最新价', '成交量']])
                
            else:
                print("⚠️  未获取到市场数据，可能原因:")
                print("   1. 市场未开盘（美东时间 9:30-16:00）")
                print("   2. 账户没有订阅期权市场数据")
                print("   3. 这些期权没有交易活动")
        else:
            print("❌ 未能获取期权合约")
            
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # 断开连接
        client.disconnect()


if __name__ == '__main__':
    main()
