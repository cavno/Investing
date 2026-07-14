"""
盈透证券API - 期权链数据获取（简化版）
避免复杂的API调用，更加稳定
"""

from ib_insync import *
import pandas as pd
from datetime import datetime


class IBOptionsChainSimple:
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
            print(f"✅ 成功连接到IB: {self.host}:{self.port}")
            return True
        except Exception as e:
            print(f"❌ 连接失败: {e}")
            return False
    
    def disconnect(self):
        """断开IB连接"""
        self.ib.disconnect()
        print("已断开IB连接")
    
    def get_stock_price(self, symbol, exchange='SMART', currency='USD'):
        """
        获取股票当前价格
        
        返回:
            float: 股票价格，如果失败返回None
        """
        try:
            stock = Stock(symbol, exchange, currency)
            self.ib.qualifyContracts(stock)
            
            # 使用reqMktData获取快照
            ticker = self.ib.reqMktData(stock, '', True, False)
            self.ib.sleep(2)
            
            # 尝试多种价格来源
            if ticker.last == ticker.last:  # 不是NaN
                price = ticker.last
            elif ticker.close == ticker.close:
                price = ticker.close
            elif ticker.bid == ticker.bid and ticker.ask == ticker.ask:
                price = (ticker.bid + ticker.ask) / 2
            else:
                price = None
            
            self.ib.cancelMktData(stock)
            return price
            
        except Exception as e:
            print(f"   获取股价失败: {e}")
            return None
    
    def get_options_chain(self, symbol, exchange='SMART', currency='USD', 
                         expiration=None, strike_percent=30):
        """
        获取期权链数据（简化版）
        
        参数:
            symbol: 标的代码 (如 'AAPL', 'SPY')
            exchange: 交易所 (默认 'SMART')
            currency: 货币 (默认 'USD')
            expiration: 到期日 (格式: 'YYYYMMDD', 如 '20250117')
            strike_percent: 行权价范围百分比 (默认30，即±30%)
        
        返回:
            list: 合格的期权合约列表
        """
        print(f"\n{'='*60}")
        print(f"获取 {symbol} 的期权链")
        print(f"{'='*60}")
        
        # 1. 创建标的合约
        stock = Stock(symbol, exchange, currency)
        self.ib.qualifyContracts(stock)
        print(f"✅ 标的合约: {stock}")
        
        # 2. 获取期权链参数
        print(f"\n正在查询期权链参数...")
        chains = self.ib.reqSecDefOptParams(
            stock.symbol, '', stock.secType, stock.conId
        )
        
        if not chains:
            print(f"❌ 未找到 {symbol} 的期权链")
            return None
        
        chain = chains[0]
        print(f"✅ 交易所: {chain.exchange}")
        
        # 3. 选择到期日
        available_expirations = sorted(chain.expirations)
        print(f"✅ 可用到期日数量: {len(available_expirations)}")
        print(f"   最近5个: {available_expirations[:5]}")
        
        if expiration is None:
            expiration = available_expirations[0]
            print(f"✅ 使用到期日: {expiration}")
        elif expiration not in available_expirations:
            print(f"⚠️  指定的到期日 {expiration} 不可用，使用: {available_expirations[0]}")
            expiration = available_expirations[0]
        else:
            print(f"✅ 使用到期日: {expiration}")
        
        # 4. 获取股票价格
        print(f"\n正在获取 {symbol} 当前价格...")
        current_price = self.get_stock_price(symbol, exchange, currency)
        
        # 5. 筛选行权价
        all_strikes = sorted(chain.strikes)
        print(f"✅ 所有行权价数量: {len(all_strikes)}")
        print(f"   范围: ${min(all_strikes):.2f} - ${max(all_strikes):.2f}")
        
        if current_price:
            print(f"✅ 当前股价: ${current_price:.2f}")
            
            # 计算行权价范围
            lower_bound = current_price * (1 - strike_percent/100)
            upper_bound = current_price * (1 + strike_percent/100)
            
            strikes = [s for s in all_strikes if lower_bound <= s <= upper_bound]
            print(f"✅ 筛选后行权价: {len(strikes)} 个 (±{strike_percent}%)")
            print(f"   范围: ${min(strikes):.2f} - ${max(strikes):.2f}")
        else:
            # 如果无法获取股价，使用中间的行权价
            mid_idx = len(all_strikes) // 2
            start = max(0, mid_idx - 10)
            end = min(len(all_strikes), mid_idx + 10)
            strikes = all_strikes[start:end]
            print(f"⚠️  无法获取股价，使用中间的 {len(strikes)} 个行权价")
        
        # 6. 构建期权合约
        print(f"\n正在构建期权合约...")
        options = []
        
        for strike_price in strikes:
            # 看涨期权
            call_option = Option(
                symbol=symbol,
                lastTradeDateOrContractMonth=expiration,
                strike=strike_price,
                right='C',
                exchange=chain.exchange
            )
            options.append(call_option)
            
            # 看跌期权
            put_option = Option(
                symbol=symbol,
                lastTradeDateOrContractMonth=expiration,
                strike=strike_price,
                right='P',
                exchange=chain.exchange
            )
            options.append(put_option)
        
        print(f"✅ 构建了 {len(options)} 个期权合约 ({len(strikes)} 个行权价 × 2 类型)")
        
        # 7. 验证合约
        print(f"\n正在验证合约（这可能需要一些时间）...")
        qualified = []
        failed = 0
        
        # 分批验证，每批20个
        batch_size = 20
        for i in range(0, len(options), batch_size):
            batch = options[i:i+batch_size]
            
            try:
                qualified_batch = self.ib.qualifyContracts(*batch)
                qualified.extend(qualified_batch)
            except Exception as e:
                # 如果批次失败，尝试单个验证
                for opt in batch:
                    try:
                        q = self.ib.qualifyContracts(opt)
                        if q:
                            qualified.extend(q)
                        else:
                            failed += 1
                    except:
                        failed += 1
            
            # 显示进度
            progress = min(i + batch_size, len(options))
            print(f"   进度: {progress}/{len(options)} ({progress*100//len(options)}%)", end='\r')
        
        print(f"\n✅ 验证完成!")
        print(f"   成功: {len(qualified)} 个")
        if failed > 0:
            print(f"   失败: {failed} 个 (可能这些合约不存在)")
        
        return qualified
    
    def get_market_data(self, contracts, wait_time=3):
        """
        获取期权合约的市场数据（简化版）
        
        参数:
            contracts: 期权合约列表
            wait_time: 等待数据的时间（秒）
        
        返回:
            DataFrame包含市场数据
        """
        if not contracts:
            print("❌ 没有合约需要获取数据")
            return pd.DataFrame()
        
        print(f"\n{'='*60}")
        print(f"获取 {len(contracts)} 个期权的市场数据")
        print(f"{'='*60}")
        
        # 请求市场数据
        tickers = []
        print(f"\n正在请求市场数据...")
        
        for i, contract in enumerate(contracts, 1):
            try:
                ticker = self.ib.reqMktData(contract, '', True, False)
                tickers.append(ticker)
                
                if i % 20 == 0:
                    print(f"   已请求: {i}/{len(contracts)}", end='\r')
                    
            except Exception as e:
                print(f"\n   ⚠️  请求失败 [{contract.strike} {contract.right}]: {e}")
        
        print(f"\n✅ 已请求 {len(tickers)} 个合约的数据")
        print(f"   等待 {wait_time} 秒获取数据...")
        self.ib.sleep(wait_time)
        
        # 整理数据
        print(f"\n正在整理数据...")
        data = []
        valid_count = 0
        
        for ticker in tickers:
            contract = ticker.contract
            
            # 获取价格
            if ticker.last == ticker.last:
                last_price = ticker.last
            elif ticker.close == ticker.close:
                last_price = ticker.close
            elif ticker.bid == ticker.bid and ticker.ask == ticker.ask:
                last_price = (ticker.bid + ticker.ask) / 2
            else:
                last_price = None
            
            # 如果没有任何价格数据，跳过
            if last_price is None and ticker.bid != ticker.bid and ticker.ask != ticker.ask:
                continue
            
            valid_count += 1
            
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
                '买量': ticker.bidSize if ticker.bidSize == ticker.bidSize else 0,
                '卖量': ticker.askSize if ticker.askSize == ticker.askSize else 0,
                '成交量': ticker.volume if ticker.volume == ticker.volume else 0,
                '未平仓量': ticker.openInterest if ticker.openInterest == ticker.openInterest else 0,
                '隐含波动率': ticker.impliedVolatility if ticker.impliedVolatility == ticker.impliedVolatility else None,
            })
        
        # 取消所有订阅
        for ticker in tickers:
            self.ib.cancelMktData(ticker.contract)
        
        print(f"✅ 获得 {valid_count} 个期权的有效数据")
        
        if valid_count == 0:
            print("⚠️  警告: 没有获取到有效的市场数据")
            print("   可能原因:")
            print("   1. 市场未开盘（美东时间 9:30-16:00）")
            print("   2. 需要订阅市场数据权限")
            print("   3. 这些期权没有交易活动")
        
        df = pd.DataFrame(data)
        
        # 排序
        if not df.empty:
            df = df.sort_values(['类型', '行权价'])
            df = df.reset_index(drop=True)
        
        return df


def main():
    """主函数示例"""
    # 创建客户端
    client = IBOptionsChainSimple(
        host='127.0.0.1',
        port=7496,
        client_id=1
    )
    
    # 连接
    if not client.connect():
        print("\n请检查:")
        print("1. TWS/Gateway是否正在运行?")
        print("2. 端口号是否正确? (模拟: 7497, 实盘: 7496)")
        print("3. 是否启用了Socket连接?")
        return
    
    try:
        # 设置参数
        symbol = 'AAPL'
        expiration = None  # None表示使用最近的到期日
        
        # 获取期权链
        contracts = client.get_options_chain(
            symbol=symbol,
            expiration=expiration,
            strike_percent=30  # 获取±30%范围的行权价
        )
        
        if not contracts:
            print("\n❌ 未能获取期权合约")
            return
        
        # 获取市场数据
        df = client.get_market_data(contracts, wait_time=3)
        
        if df.empty:
            print("\n❌ 未能获取市场数据")
            return
        
        # 显示结果
        print(f"\n{'='*60}")
        print(f"期权链数据总览")
        print(f"{'='*60}")
        
        # 基本统计
        calls = df[df['类型'] == '看涨']
        puts = df[df['类型'] == '看跌']
        
        print(f"\n数据统计:")
        print(f"  总期权数: {len(df)}")
        print(f"  看涨期权: {len(calls)}")
        print(f"  看跌期权: {len(puts)}")
        
        # 显示数据样本
        print(f"\n数据样本 (前10条):")
        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', None)
        pd.set_option('display.float_format', lambda x: f'{x:.4f}')
        
        display_cols = ['行权价', '类型', '最新价', '买价', '卖价', 
                       '成交量', '未平仓量', '隐含波动率']
        print(df[display_cols].head(10).to_string(index=False))
        
        # 保存到CSV
        filename = f"{symbol}_{df['到期日'].iloc[0]}_options.csv"
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"\n✅ 数据已保存到: {filename}")
        
        # 成交量分析
        if df['成交量'].sum() > 0:
            print(f"\n成交量分析:")
            print(f"  总成交量: {df['成交量'].sum():,.0f}")
            print(f"  看涨成交量: {calls['成交量'].sum():,.0f}")
            print(f"  看跌成交量: {puts['成交量'].sum():,.0f}")
            
            if calls['成交量'].sum() > 0:
                pcr = puts['成交量'].sum() / calls['成交量'].sum()
                print(f"  P/C比率: {pcr:.2f}")
            
            print(f"\n成交量Top 5:")
            top5 = df.nlargest(5, '成交量')[['行权价', '类型', '成交量', '最新价']]
            print(top5.to_string(index=False))
        
    except KeyboardInterrupt:
        print("\n\n程序被用户中断")
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # 断开连接
        print(f"\n{'='*60}")
        client.disconnect()


if __name__ == '__main__':
    main()
