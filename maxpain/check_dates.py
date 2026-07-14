from futu import OpenQuoteContext, Market

quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)

ret, data = quote_ctx.get_option_expiration_date('US.AAPL')

if ret == 0:
    print("AAPL 可用的期权到期日：")
    for date in data['strike_time'].tolist()[:20]:
        print(f"  {date}")
else:
    print(f"错误: {data}")

quote_ctx.close()
input("\n按回车退出...")