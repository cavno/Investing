// Auto-generated from 期权策略.xlsx
const STRATEGIES = [
  {
    "name": "Long Call",
    "nickname": "",
    "delta": "Long Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish",
    "structure": "Single Option",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Long Call",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Bull Call Spread",
    "nickname": "Discounted Long Call/Long Bull Call Spread/Long Call Spread/Call Debit Spread",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long ITM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Reducing cost basis"
      }
    ]
  },
  {
    "name": "Cash-Secured Put",
    "nickname": "",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish",
    "structure": "Single Option",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Short Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Short Put",
    "nickname": "",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish",
    "structure": "Single Option",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Bull Put Spread",
    "nickname": "Insured Short Put/Short Bull Put Spread/Short Put Spread",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Further OTM Put",
        "effect": "Controlled Risk"
      }
    ]
  },
  {
    "name": "Long Put",
    "nickname": "",
    "delta": "Short Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish",
    "structure": "Single Option",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Long Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Bear Put Spread",
    "nickname": "Discounted Long Put/Long Bear Put Spread/Long Put Spread",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Further OTM Put",
        "effect": "Reducing cost basis"
      }
    ]
  },
  {
    "name": "Short Call",
    "nickname": "",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish",
    "structure": "Single Option",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short Call",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Bear Call Spread",
    "nickname": "Insured Short Call/Short Bear Call Spread/Short Call Spread",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Further OTM Call",
        "effect": "Controlled Risk"
      }
    ]
  },
  {
    "name": "Long Straddle",
    "nickname": "Straddle",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ATM Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Long Strangle",
    "nickname": "Strangle/Economic Long Straddle",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Short Straddle",
    "nickname": "Naked Short ATM Call + Naked Short ATM Put",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Combinations",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Call",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation/Risk Source"
      }
    ]
  },
  {
    "name": "Short Strangle",
    "nickname": "Naked Short OTM Call + Naked Short OTM Put",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Combinations",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation/Upset Risk Source"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation/Downset Risk Source"
      }
    ]
  },
  {
    "name": "Covered Call",
    "nickname": "",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Hedge",
    "purpose": "Directional - Bullish",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Buy Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Call",
        "effect": "Premium Harvesting"
      }
    ]
  },
  {
    "name": "Protective Call",
    "nickname": "",
    "delta": "Short Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Hedge",
    "purpose": "Directional - Bearish",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Short Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Call",
        "effect": "Hedging"
      }
    ]
  },
  {
    "name": "Covered Put",
    "nickname": "",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Hedge",
    "purpose": "Directional - Bearish",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Short Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Put",
        "effect": "Premium Harvesting"
      }
    ]
  },
  {
    "name": "Protective Put",
    "nickname": "",
    "delta": "Long Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Hedge",
    "purpose": "Directional - Bullish",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Novice",
    "legs": [
      {
        "construction": "Buy Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Put",
        "effect": "Hedging"
      }
    ]
  },
  {
    "name": "Long Collar",
    "nickname": "Protective Put + Covered Call",
    "delta": "Long Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Zero-Cost / Credit / Debit",
    "trader_role": "Hedge",
    "purpose": "Directional - Bullish",
    "structure": "Stock-Option - Hedging Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Buy Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Put",
        "effect": "Hedging"
      },
      {
        "construction": "Short Call",
        "effect": "Finance the hedge"
      }
    ]
  },
  {
    "name": "Short Collar",
    "nickname": "Protective Call + Covered Put",
    "delta": "Short Delta",
    "gamma": "Neutral Gamma",
    "vega": "Neutral Vega",
    "theta": "Neutral Theta",
    "cash_flow": "Zero-Cost / Credit / Debit",
    "trader_role": "Hedge",
    "purpose": "Directional - Bearish",
    "structure": "Stock-Option - Hedging Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Call",
        "effect": "Hedging"
      },
      {
        "construction": "Short Put",
        "effect": "Finance the hedge"
      }
    ]
  },
  {
    "name": "Short Diagonal Bull Put Spread",
    "nickname": "用LEAPS Put来做的增强版Covered Put/Selling a Far-Term Bull Put Spread",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Long Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator + Hedge",
    "purpose": "Directional - Bullish",
    "structure": "Diagonal Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short Back Month OTM Put",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long Front Month Further OTM Put",
        "effect": "Risk Control & P/L Shaping"
      }
    ]
  },
  {
    "name": "Long Diagonal Bull Call Spread",
    "nickname": "Poor Man's Covered Call, PMCC",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Long Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator + Hedge",
    "purpose": "Directional - Bullish",
    "structure": "Diagonal Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long LEAPS Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Frontmonth Call",
        "effect": "Premium Harvesting"
      }
    ]
  },
  {
    "name": "Short Diagonal Bear Call Spread",
    "nickname": "Selling a Far-Term Bear Call Spread",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator + Hedge",
    "purpose": "Directional - Bearish",
    "structure": "Diagonal Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short Back Month OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Front Month Further OTM Call",
        "effect": "Risk Control & P/L Shaping"
      }
    ]
  },
  {
    "name": "Long Diagonal Bear Put Spread",
    "nickname": "资本效率更高的Covered Put",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Long Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator + Hedge",
    "purpose": "Directional - Bearish",
    "structure": "Diagonal Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long Backmonth Futher ITM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Frontmonth Put",
        "effect": "Premium Harvesting"
      }
    ]
  },
  {
    "name": "Long Call Calendar Spread",
    "nickname": "Selling a Far-Term Bear Call Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Long Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Horizontal Spreads",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short Back Month OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Front Month Further OTM Call",
        "effect": "Risk Control & P/L Shaping"
      }
    ]
  },
  {
    "name": "Long Put Calendar Spread",
    "nickname": "Short Near-Term Put + Long Far-Term Put",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Long Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Horizontal Spreads",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short Front Month Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Back Month Put",
        "effect": "Risk Control & Volatility Engine"
      }
    ]
  },
  {
    "name": "Short Call Calendar Spread",
    "nickname": "积木策略",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Short Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Horizontal Spreads",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long Front Month Call",
        "effect": "Volatility Engine"
      },
      {
        "construction": "Short Back Month Call",
        "effect": "Volatility Engine"
      }
    ]
  },
  {
    "name": "Short Put Calendar Spread",
    "nickname": "积木策略",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Short Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Horizontal Spreads",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long Front Month Put",
        "effect": "Volatility Engine"
      },
      {
        "construction": "Short Back Month Put",
        "effect": "Volatility Engine"
      }
    ]
  },
  {
    "name": "Long Call Butterfly",
    "nickname": "Bull Call Spread + Bear Call Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Long OTM Call",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Long Put Butterfly",
    "nickname": "Bear Put Spread + Bull Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Put",
        "effect": "Upset Risk Control"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Downset Risk Control"
      }
    ]
  },
  {
    "name": "Short Call Butterfly",
    "nickname": "Bear Call Spread + Bull Call Spread",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ITM Cal",
        "effect": "Risk Control"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Short Put Butterfly",
    "nickname": "Bull Put Spread + Bear Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ITM Put",
        "effect": "Premium Harvesting/Reducing cost basis"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Premium Harvesting/Reducing cost basis"
      }
    ]
  },
  {
    "name": "Long Call Condor",
    "nickname": "Bull Call Spread + Bear Call Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Futher OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long OTM Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Long Futher OTM Call",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Long Put Condor",
    "nickname": "Bear Put Spread + Bull Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Futher ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Put",
        "effect": "Risk Control"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Short Call Condor",
    "nickname": "Bear Call Spread + Bull Call Spread",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long Inner, Lower Strike Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Inner, Higher Strike Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Outer, Higher Strike Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Short Outer, Highest Strike Call",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Short Put Condor",
    "nickname": "Bull Put Spread + Bear Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long Inner, Lower Strike Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Inner, Higher Strike Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Outer, Lowest Strike Put",
        "effect": "Cost Reduction & Risk Control"
      },
      {
        "construction": "Short Outer, Highest Strike Put",
        "effect": "Cost Reduction & Risk Control"
      }
    ]
  },
  {
    "name": "Short Iron Butterfly",
    "nickname": "Iron Butterfly/Insured Short Straddle = Bull Call Spread + Bear Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long OTM Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Long Iron Butterfly",
    "nickname": "Reverse/Inverse Iron Butterfly/Discounted/Capped Long Straddle = Bull Call Spread + Bear Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Controlled Risk"
      },
      {
        "construction": "Long ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Controlled Risk"
      }
    ]
  },
  {
    "name": "Short Iron Condor",
    "nickname": "Iron Condor/Insured Short Strangle = Bear Call Spread + Bull Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Further OTM Put",
        "effect": "Controlled Risk"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Further OTM Call",
        "effect": "Controlled Risk"
      }
    ]
  },
  {
    "name": "Long Iron Condor",
    "nickname": "Reverse/Inverse Iron Condor/Discounted/Capped Long Strangle = Bull Call Spread + Bear Put Spread",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Intermediate",
    "legs": [
      {
        "construction": "Long OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Further OTM Put",
        "effect": "Controlled Risk"
      },
      {
        "construction": "Long OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short Further OTM Call",
        "effect": "Controlled Risk"
      }
    ]
  },
  {
    "name": "Covered Short Straddle",
    "nickname": "Long Stock + Short Straddle",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Buy Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Covered Short Strangle",
    "nickname": "Long Stock + Short Strangle/Covered Call + Naked Short OTM Put",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Buy Stocks",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Bull Call Ladder",
    "nickname": "Bull Call Spread + Naked Short OTM Call",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long ITM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ATM Call",
        "effect": "Reducing cost basis"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Premium Harvesting"
      }
    ]
  },
  {
    "name": "Bear Call Ladder",
    "nickname": "Bear Call Spread + Naked Long OTM Call",
    "delta": "Neutral to Long Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Zero-Cost / Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ITM Call",
        "effect": "Reducing cost basis"
      }
    ]
  },
  {
    "name": "Bull Put Ladder",
    "nickname": "Bear Put Spread + Naked Short OTM Put",
    "delta": "Neutral to Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Put",
        "effect": "Controlled Risk"
      }
    ]
  },
  {
    "name": "Bear Put Ladder",
    "nickname": "Bull Put Spread + Naked Long OTM Put",
    "delta": "Long to Short Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Zero-Cost / Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ITM Put",
        "effect": "Reducing cost basis"
      }
    ]
  },
  {
    "name": "Call Ratio Backspread",
    "nickname": "Bull Call Spread + Naked Long Call",
    "delta": "Long Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ATM/ITM Call",
        "effect": "Reducing cost basis"
      }
    ]
  },
  {
    "name": "Put Broken Wing",
    "nickname": "Bear Put Spread + Bull Put Spread",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Put",
        "effect": "Controlled Risk"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Reducing cost basis"
      }
    ]
  },
  {
    "name": "Inverse Call Broken Wing",
    "nickname": "一个标准蝶式价差的变形/两个宽度不等的垂直价差的组合",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Put",
        "effect": "Controlled Risk + Reducing cost basis"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Controlled Risk + Reducing cost basis"
      }
    ]
  },
  {
    "name": "Put Ratio Backspread",
    "nickname": "Bull Put Spread + Naked Long OTM Put",
    "delta": "Short Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Zero-Cost / Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Long Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Long OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short ITM/ATM Put",
        "effect": "Reducing cost basis/Risk Source"
      }
    ]
  },
  {
    "name": "Call Broken Wing",
    "nickname": "Bull Call Spread + Bear Call Spread",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ITM Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Long OTM Call",
        "effect": "P/L Shaping"
      }
    ]
  },
  {
    "name": "Inverse Put Broken Wing",
    "nickname": "Reverse/Inverse Put BWB:Bear Put Spread + Bull Put Spread",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short ATM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long OTM Put",
        "effect": "Risk Control"
      },
      {
        "construction": "Long ITM Put",
        "effect": "P/L Shaping"
      }
    ]
  },
  {
    "name": "Jade Lizard",
    "nickname": "Naked Short OTM Call + Bull Put Spread",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Short Volatility",
    "structure": "Combinations + Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Futher OTM Put",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Reverse Jade Lizard",
    "nickname": "Naked Short OTM Put + Bear Call Spread",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Combinations + Vertical Spread",
    "skill": "Advanced",
    "legs": [
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long Further OTM Call",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Call Ratio Spread",
    "nickname": "Bull Call Spread + Naked Short OTM Call",
    "delta": "Short Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Short OTM Call",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ATM/ITM Call",
        "effect": "P/L Shaping/Risk Control"
      }
    ]
  },
  {
    "name": "Put Ratio Spread",
    "nickname": "Bear Put Spread + Naked Short OTM Put",
    "delta": "Long Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Short Volatility",
    "structure": "Vertical Spread",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Short OTM Put",
        "effect": "Income Generation"
      },
      {
        "construction": "Long ATM/ITM Put",
        "effect": "P/L Shaping/Risk Control"
      }
    ]
  },
  {
    "name": "Long Synthetic Future",
    "nickname": "",
    "delta": "Long Delta",
    "gamma": "Neutral Gamma",
    "vega": "Neutral Vega",
    "theta": "Neutral Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator + Hedger + Arbitrageur",
    "purpose": "Directional - Bullish",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Long ATM Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Short ATM Put",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Short Synthetic Future",
    "nickname": "",
    "delta": "Short Delta",
    "gamma": "Neutral Gamma",
    "vega": "Neutral Vega",
    "theta": "Neutral Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator + Hedger + Arbitrageur",
    "purpose": "Directional - Bearish",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Short ATM Call",
        "effect": "Risk Control"
      },
      {
        "construction": "Long ATM Put",
        "effect": "Risk Control"
      }
    ]
  },
  {
    "name": "Synthetic Put",
    "nickname": "",
    "delta": "Short Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator + Hedger + Arbitrageur",
    "purpose": "Directional - Bearish + Non-Directional - Long Volatility",
    "structure": "Stock-Option - Covered/Protective Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Short Stocks",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long ATM Call",
        "effect": "P/L Shaping/Risk Control"
      }
    ]
  },
  {
    "name": "Long Combo",
    "nickname": "Risk Reversal",
    "delta": "Long Delta",
    "gamma": "Neutral Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Zero-Cost / Credit",
    "trader_role": "Speculator + Hedge",
    "purpose": "Directional - Bullish",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Long OTM Call",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Short OTM Put",
        "effect": "Reducing cost basis/Risk Source"
      }
    ]
  },
  {
    "name": "Short Combo",
    "nickname": "Short Risk Reversal",
    "delta": "Short Delta",
    "gamma": "Neutral Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator + Hedge",
    "purpose": "Directional - Bearish",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Long OTM Put",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Short OTM Call",
        "effect": "Reducing cost basis/Risk Source"
      }
    ]
  },
  {
    "name": "Strip",
    "nickname": "Long Straddle + Naked Long Put",
    "delta": "Short Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bearish + Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long ATM Put",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long ATM Put",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Strap",
    "nickname": "Long Straddle + Naked Long Call",
    "delta": "Long Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Directional - Bullish + Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Long ATM Put",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long ATM Call",
        "effect": "Income Generation"
      }
    ]
  },
  {
    "name": "Long Guts",
    "nickname": "A Long Straddle using ITM options",
    "delta": "Neutral Delta",
    "gamma": "Long Gamma",
    "vega": "Long Vega",
    "theta": "Short Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Long Volatility",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Long ITM Call",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long ITM Put",
        "effect": "Income Generation/Risk Source"
      }
    ]
  },
  {
    "name": "Short Guts",
    "nickname": "A Short Straddle using ITM options",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Short Vega",
    "theta": "Long Theta",
    "cash_flow": "Credit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Combinations",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Short ITM Call",
        "effect": "Income Generation/Upset Risk Source"
      },
      {
        "construction": "Short ITM Put",
        "effect": "Income Generation/Downset Risk Source"
      }
    ]
  },
  {
    "name": "Double Diagonal",
    "nickname": "Diagonal Bull Put Spread + Diagonal Bear Call Spread/Short Near-Term Strangle + Long Far-Term Strangle",
    "delta": "Neutral Delta",
    "gamma": "Short Gamma",
    "vega": "Long Vega",
    "theta": "Long Theta",
    "cash_flow": "Debit",
    "trader_role": "Speculator",
    "purpose": "Non-Directional - Short Volatility",
    "structure": "Combinations + Diagonal Spread",
    "skill": "Expert",
    "legs": [
      {
        "construction": "Short Front Month Call",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Short Front Month Put",
        "effect": "Income Generation/Risk Source"
      },
      {
        "construction": "Long Back Month Call",
        "effect": "Risk Control & Volatility Engine"
      },
      {
        "construction": "Long Back Month Put",
        "effect": "Risk Control & Volatility Engine"
      }
    ]
  }
];
