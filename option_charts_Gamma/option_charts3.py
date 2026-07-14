import xlwings as xw
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm
from pathlib import Path

# ==============================================================================
#  1. Helper function to calculate Gamma (Same for Calls and Puts)
# ==============================================================================
def black_scholes_gamma(S, K, T, r, sigma):
    """
    Calculates the Gamma of a European option.
    """
    if T <= 0:
        return np.zeros_like(S)
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    pdf_d1 = norm.pdf(d1)
    gamma = pdf_d1 / (S * sigma * np.sqrt(T))
    return gamma

# ==============================================================================
#  2. Main subroutine for the unified Gamma chart
# ==============================================================================
@xw.sub
def generate_and_insert_gamma_chart_unified():
    """
    Reads parameters from Excel, generates a single gamma chart with combined
    Call and Put perspective labels, saves it, and inserts it into the sheet.
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
        S_range = np.linspace(K * 0.7, K * 1.3, 200)

        # Calculate the two Gamma curves
        gamma_near_term = black_scholes_gamma(S_range, K, T_near, r, sigma)
        gamma_far_term = black_scholes_gamma(S_range, K, T_far, r, sigma)

        # --- Create the plot ---
        fig, ax = plt.subplots(figsize=(10, 6))

        # Plot the Far-Term and Near-Term Gamma curves
        ax.plot(S_range, gamma_far_term, label=f'Far-Term Option (T={time_far_days:.0f} days)', color='blue', linewidth=2)
        ax.plot(S_range, gamma_near_term, label=f'Near-Term Option (T={time_near_days:.0f} days)', color='red', linestyle='--', linewidth=2)

        # --- Format the chart ---
        ax.set_title('Option Gamma (Γ) Behavior (Universal for Call & Put)', fontsize=16)
        ax.set_xlabel('Underlying Asset Price', fontsize=12)
        ax.set_ylabel('Gamma Value', fontsize=12)
        
        # Add reference lines
        ax.axvline(x=K, color='black', linestyle=':', linewidth=1.5, label=f'Strike Price (ATM) = {K:.2f}')
        
        # --- Use combined OTM/ATM/ITM labels ---
        y_pos = ax.get_ylim()[1] * 0.05 
        
        left_label = 'Call: OTM\nPut: ITM'
        right_label = 'Call: ITM\nPut: OTM'
        
        ax.text(K * 0.85, y_pos, left_label, ha='center', fontsize=9, va='bottom', linespacing=1.5)
        ax.text(K, y_pos, 'ATM\n(At-the-Money)', ha='center', fontsize=9, va='bottom', linespacing=1.5)
        ax.text(K * 1.15, y_pos, right_label, ha='center', fontsize=9, va='bottom', linespacing=1.5)

        # Set axis limits and grid
        ax.set_xlim(min(S_range), max(S_range))
        ax.grid(True, linestyle='--', alpha=0.6)
        ax.legend(fontsize=10)
        plt.tight_layout()

        # --- Save the chart and insert it into Excel ---
        chart_path = Path(sht.book.fullname).parent / 'gamma_chart_unified.png'
        
        for picture in sht.pictures:
            if picture.name == 'GammaChartUnified':
                picture.delete()
        
        fig.savefig(chart_path, dpi=150)
        plt.close(fig)
        
        sht.pictures.add(
            chart_path,
            name='GammaChartUnified',
            update=True,
            left=sht.range('D2').left,
            top=sht.range('D2').top,
            width=400,
            height=250
        )

    except Exception as e:
        xw.Book.caller().sheets.active.range('A7').value = f"Python Error: {e}"