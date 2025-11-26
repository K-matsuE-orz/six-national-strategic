import yfinance as yf
import json
import os
from datetime import datetime, timedelta

# Define sectors and their top 5 stocks (Large Cap)
SECTORS = {
    "AI_Robot": ["9984.T", "6861.T", "6954.T", "6273.T", "6645.T"],
    "Quantum": ["6702.T", "6701.T", "9432.T", "6501.T", "6503.T"],
    "Semi": ["8035.T", "6857.T", "4063.T", "6146.T", "6920.T"],
    "Bio": ["4519.T", "4568.T", "4502.T", "4578.T", "4503.T"],
    "Fusion": ["7013.T", "5802.T", "5803.T", "5801.T", "1963.T"],
    "Space": ["7011.T", "7012.T", "9412.T", "7751.T", "9433.T"]
}

def fetch_sector_performance():
    results = {}
    
    # Calculate start date (e.g., 1 month ago)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    print(f"Fetching data from {start_date.date()} to {end_date.date()}...")

    for sector, tickers in SECTORS.items():
        sector_changes = []
        print(f"Processing {sector}...")
        
        for ticker in tickers:
            try:
                # Fetch data
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1mo")
                
                if len(hist) < 2:
                    print(f"  Warning: Insufficient data for {ticker}")
                    continue
                
                # Calculate percent change over the period
                start_price = hist['Close'].iloc[0]
                end_price = hist['Close'].iloc[-1]
                
                if start_price == 0:
                    continue
                    
                change = ((end_price - start_price) / start_price) * 100
                sector_changes.append(change)
                print(f"  {ticker}: {change:.2f}%")
                
            except Exception as e:
                print(f"  Error fetching {ticker}: {e}")
        
        # Calculate average for the sector
        if sector_changes:
            avg_change = sum(sector_changes) / len(sector_changes)
            results[sector] = {
                "change_percent": round(avg_change, 2),
                "tickers": tickers
            }
        else:
            results[sector] = {
                "change_percent": 0,
                "tickers": tickers
            }

    return results

def save_to_json(data):
    output_data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "sectors": data
    }
    
    # Ensure public directory exists
    os.makedirs("public", exist_ok=True)
    
    with open("public/stock_data.json", "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    print("Saved data to public/stock_data.json")

if __name__ == "__main__":
    data = fetch_sector_performance()
    save_to_json(data)
