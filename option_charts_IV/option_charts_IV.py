import xlwings as xw
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from pathlib import Path

# ==============================================================================
#  1. Helper function to simulate a realistic equity IV Skew.
# ==============================================================================
def simulate_iv_skew(strikes, spot_price, atm_vol):
    """
    Simulates a realistic IV skew for a given range of strike prices.
    """
    iv = []
    for k in strikes:
        # Calculate how far the strike is from the spot price
        moneyness = (k - spot_price)
        
        # A simple quadratic formula to create the base "smile"
        smile_effect = 0.0007 * (moneyness**2)
        
        # A linear formula to create the "skew" (making lower strikes have higher IV)
        skew_effect = -0.005 * moneyness
        
        # Combine the effects with the base ATM volatility
        iv.append(atm_vol + smile_effect + skew_effect)
        
    return np.array(iv)

# ==============================================================================
#  2. Main subroutine for the unified IV Skew chart
# ==============================================================================
@xw.sub
def generate_and_insert_iv_skew_chart_unified():
    """
    Reads parameters from Excel, generates a single IV Smile/Skew chart with 
    combined Call/Put labels, saves it, and inserts it into the sheet.
    """
    try:
        # --- Get the active workbook and sheet ---
        sht = xw.Book.caller().sheets.active

        # --- Read parameters from predefined cells ---
        # Note: This chart uses different parameters than the Greek charts.
        spot_price = sht.range('B1').value
        atm_vol = sht.range('B2').value
        
        # --- Prepare data for plotting ---
        strike_range = np.linspace(spot_price * 0.75, spot_price * 1.25, 50) # X-axis data
        iv_curve = simulate_iv_skew(strike_range, spot_price, atm_vol) # Y-axis data

        # --- Create the plot ---
        fig, ax = plt.subplots(figsize=(10, 6))

        # Plot the IV Skew curve
        ax.plot(strike_range, iv_curve, label='Implied Volatility Curve', color='purple', linewidth=2)

        # --- Format the chart ---
        ax.set_title('Implied Volatility Smile & Skew (Universal for Call & Put)', fontsize=16)
        ax.set_xlabel('Strike Price (K)', fontsize=12)
        ax.set_ylabel('Implied Volatility (IV %)', fontsize=12)
        
        # Format Y-axis to show percentages
        ax.yaxis.set_major_formatter(mticker.PercentFormatter(xmax=1.0))
        
        # Add a vertical line for the At-the-Money (ATM) point
        ax.axvline(x=spot_price, color='black', linestyle=':', linewidth=1.5, label=f'Spot Price (ATM) = {spot_price:.2f}')
        
        # --- Use combined OTM/ATM/ITM labels ---
        # Note: For a STRIKE PRICE axis, the ITM/OTM logic is different than for a Spot Price axis.
        y_pos = ax.get_ylim()[0] # Place text at the bottom of the chart
        
        left_label = 'Call: ITM\nPut: OTM'  # Low strikes are ITM for Calls, OTM for Puts
        right_label = 'Call: OTM\nPut: ITM' # High strikes are OTM for Calls, ITM for Puts
        
        # Add a small padding from the bottom axis
        y_padding = (ax.get_ylim()[1] - ax.get_ylim()[0]) * 0.02
        
        ax.text(spot_price * 0.85, y_pos + y_padding, left_label, ha='center', fontsize=9, va='bottom', linespacing=1.5)
        ax.text(spot_price, y_pos + y_padding, 'ATM', ha='center', fontsize=9, va='bottom')
        ax.text(spot_price * 1.15, y_pos + y_padding, right_label, ha='center', fontsize=9, va='bottom', linespacing=1.5)
        
        # Set axis limits and grid
        ax.set_xlim(min(strike_range), max(strike_range))
        ax.grid(True, linestyle='--', alpha=0.6)
        ax.legend(loc='upper right')
        plt.tight_layout()

        # --- Save the chart and insert it into Excel ---
        chart_path = Path(sht.book.fullname).parent / 'iv_skew_chart_unified.png'

        for picture in sht.pictures:
            if picture.name == 'IVSkewChartUnified':
                picture.delete()
        
        fig.savefig(chart_path, dpi=150)
        plt.close(fig)
        
        sht.pictures.add(
            chart_path,
            name='IVSkewChartUnified',
            update=True,
            left=sht.range('D2').left,
            top=sht.range('D2').top,
            width=450,
            height=300
        )

    except Exception as e:
        xw.Book.caller().sheets.active.range('A7').value = f"Python Error: {e}"