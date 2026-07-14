import xlwings as xw
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from pathlib import Path

# ==============================================================================
#  1. Helper function to calculate the Profit/Loss of a Long Call at expiration.
# ==============================================================================
def calculate_long_call_payoff(S, strike_price, premium_paid):
    """
    Calculates the P/L of a long call position at expiration.
    P/L = max(0, S - K) - Premium
    """
    intrinsic_value = np.maximum(S - strike_price, 0)
    payoff = intrinsic_value - premium_paid
    return payoff

# ==============================================================================
#  2. Main subroutine to be called from Excel as a macro.
# ==============================================================================
@xw.sub
def generate_and_insert_long_call_payoff():
    """
    Reads parameters from the active Excel sheet, generates the long call
    payoff chart, saves it as a PNG, and inserts it back into the sheet.
    """
    try:
        # --- Get the active workbook and sheet ---
        sht = xw.Book.caller().sheets.active

        # --- Read parameters from predefined cells ---
        # Note: This chart uses different parameters than the Greek charts.
        strike_price = sht.range('B1').value
        premium_paid = sht.range('B2').value
        
        # --- Prepare data for plotting ---
        # Create an X-axis range for the Underlying Price around the strike price
        S_range = np.linspace(strike_price * 0.8, strike_price * 1.2, 200)
        
        # Calculate the P/L for the Y-axis
        payoff = calculate_long_call_payoff(S_range, strike_price, premium_paid)
        
        # Calculate the breakeven point
        breakeven_price = strike_price + premium_paid

        # --- Create the plot using Matplotlib ---
        fig, ax = plt.subplots(figsize=(10, 6))

        # Plot the payoff line
        ax.plot(S_range, payoff, label='Profit / Loss Line', color='green', linewidth=2)

        # --- Format the chart with professional English labels ---
        ax.set_title('Long Call Payoff Diagram', fontsize=16)
        ax.set_xlabel('Underlying Price at Expiration', fontsize=12)
        ax.set_ylabel('Profit / Loss', fontsize=12)
        
        # Format axes to show currency
        formatter = mticker.FormatStrFormatter('$%1.2f')
        ax.xaxis.set_major_formatter(formatter)
        ax.yaxis.set_major_formatter(formatter)

        # --- Add reference lines and annotations ---
        # Breakeven line (P/L = 0)
        ax.axhline(y=0, color='black', linestyle='-', linewidth=0.75)
        # Strike price line
        ax.axvline(x=strike_price, color='gray', linestyle=':', linewidth=1.5, label=f'Strike Price = ${strike_price:.2f}')
        
        # Max Loss line and annotation
        max_loss = -premium_paid
        ax.axhline(y=max_loss, color='red', linestyle='--', linewidth=1.5, label=f'Max Loss = ${premium_paid:.2f}')

        # Breakeven point annotation
        ax.plot(breakeven_price, 0, 'ko', markersize=8) # 'ko' is a black circle
        ax.annotate(f'Breakeven\n${breakeven_price:.2f}', 
                    xy=(breakeven_price, 0), 
                    xytext=(breakeven_price, max_loss * 0.5),
                    arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=8),
                    ha='center', va='center')

        # OTM/ATM/ITM regions
        y_pos = ax.get_ylim()[0] * 1.1 # Position text just below the chart
        ax.text(strike_price * 0.9, y_pos, 'OTM', ha='center', fontsize=10)
        ax.text(strike_price, y_pos, 'ATM', ha='center', fontsize=10)
        ax.text(strike_price * 1.1, y_pos, 'ITM', ha='center', fontsize=10)
        
        # Max Profit annotation
        ax.text(S_range[-1], payoff[-1], ' Max Profit:\n Unlimited', ha='right', va='bottom', fontsize=10, color='green')

        # Set axis limits and add a grid
        ax.grid(True, linestyle='--', alpha=0.6)
        ax.legend(loc='lower right')
        plt.tight_layout()

        # --- Core Logic: Save the chart and insert it into Excel ---
        chart_path = Path(sht.book.fullname).parent / 'long_call_payoff.png'

        for picture in sht.pictures:
            if picture.name == 'LongCallPayoff':
                picture.delete()
        
        fig.savefig(chart_path, dpi=150)
        plt.close(fig)
        
        sht.pictures.add(
            chart_path,
            name='LongCallPayoff',
            update=True,
            left=sht.range('D2').left,
            top=sht.range('D2').top,
            width=500,
            height=310
        )

    except Exception as e:
        xw.Book.caller().sheets.active.range('A7').value = f"Python Error: {e}"