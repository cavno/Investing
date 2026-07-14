import xlwings as xw
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm
from pathlib import Path

# ==============================================================================
#  1. Helper functions to calculate both Call and Put Delta
# ==============================================================================
def black_scholes_call_delta(S, K, T, r, sigma):
    """Calculates the delta of a European call option."""
    if T <= 0:
        return np.where(S > K, 1.0, 0.0)
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    return norm.cdf(d1)

def black_scholes_put_delta(S, K, T, r, sigma):
    """Calculates the delta of a European put option."""
    if T <= 0:
        return np.where(S < K, -1.0, 0.0)
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    return norm.cdf(d1) - 1.0

# ==============================================================================
#  2. Main subroutine for the unified Delta chart
# ==============================================================================
@xw.sub
def generate_and_insert_delta_chart_unified():
    """
    Reads parameters from Excel, generates a single chart showing both Call and
    Put delta curves, saves it as a PNG, and inserts it into the sheet.
    """
    try:
        # --- Get workbook and sheet objects ---
        sht = xw.Book.caller().sheets.active

        # --- Read parameters from Excel ---
        K = sht.range('B1').value
        r = sht.range('B2').value
        sigma = sht.range('B3').value
        time_near_days = sht.range('B4').value
        time_far_days = sht.range('B5').value
        
        # --- Prepare data for plotting ---
        T_near = float(time_near_days) / 365.0
        T_far = float(time_far_days) / 365.0
        S_range = np.linspace(K * 0.5, K * 1.5, 100)

        # --- Calculate all four Delta curves ---
        delta_call_near = black_scholes_call_delta(S_range, K, T_near, r, sigma)
        delta_call_far = black_scholes_call_delta(S_range, K, T_far, r, sigma)
        delta_put_near = black_scholes_put_delta(S_range, K, T_near, r, sigma)
        delta_put_far = black_scholes_put_delta(S_range, K, T_far, r, sigma)

        # --- Create the plot ---
        fig, ax = plt.subplots(figsize=(10, 7))

        # --- Plot the Call Deltas (in the positive space) ---
        ax.plot(S_range, delta_call_far, label=f'Far-Term Call (T={time_far_days:.0f} days)', color='blue', linewidth=2)
        ax.plot(S_range, delta_call_near, label=f'Near-Term Call (T={time_near_days:.0f} days)', color='red', linestyle='--', linewidth=2)
        
        # --- Plot the Put Deltas (in the negative space) ---
        ax.plot(S_range, delta_put_far, label=f'Far-Term Put (T={time_far_days:.0f} days)', color='blue', linewidth=2, alpha=0.7)
        ax.plot(S_range, delta_put_near, label=f'Near-Term Put (T={time_near_days:.0f} days)', color='red', linestyle='--', linewidth=2, alpha=0.7)

        # --- Format the chart ---
        ax.set_title('Call & Put Option Delta (Δ) Behavior', fontsize=16)
        ax.set_xlabel('Underlying Asset Price', fontsize=12)
        ax.set_ylabel('Delta Value', fontsize=12)
        
        # Add reference lines
        ax.axvline(x=K, color='black', linestyle=':', linewidth=1.5, label=f'Strike Price (ATM) = {K:.2f}')
        ax.axhline(y=0.0, color='black', linestyle='-', linewidth=0.75)
        ax.axhline(y=0.5, color='gray', linestyle=':', linewidth=1)
        ax.axhline(y=-0.5, color='gray', linestyle=':', linewidth=1)

        # --- Use combined OTM/ATM/ITM labels ---
        y_pos = -1.0 # Place labels at the bottom for clarity
        left_label = 'Call: OTM\nPut: ITM'
        right_label = 'Call: ITM\nPut: OTM'
        
        ax.text(K * 0.75, y_pos, left_label, ha='center', fontsize=9, va='bottom', linespacing=1.5)
        ax.text(K, y_pos, 'ATM', ha='center', fontsize=9, va='bottom')
        ax.text(K * 1.25, y_pos, right_label, ha='center', fontsize=9, va='bottom', linespacing=1.5)

        # Set axis limits and grid
        ax.set_ylim(-1.05, 1.05)
        ax.set_xlim(min(S_range), max(S_range))
        ax.grid(True, linestyle='--', alpha=0.6)
        ax.legend(fontsize=9)
        plt.tight_layout()

        # --- Save the chart and insert it into Excel ---
        chart_path = Path(sht.book.fullname).parent / 'delta_chart_unified.png'
        
        for picture in sht.pictures:
            if picture.name == 'DeltaChartUnified':
                picture.delete()
        
        fig.savefig(chart_path, dpi=150)
        plt.close(fig)
        
        sht.pictures.add(
            chart_path,
            name='DeltaChartUnified',
            update=True,
            left=sht.range('D2').left,
            top=sht.range('D2').top,
            width=450,
            height=320
        )

    except Exception as e:
        xw.Book.caller().sheets.active.range('A7').value = f"Python Error: {e}"