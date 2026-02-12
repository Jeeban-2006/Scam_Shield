import pandas as pd
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw_dataset.csv")

df = pd.read_csv(DATA_PATH)

brands = ["google", "amazon", "microsoft", "netflix", "paypal", "instagram"]
generic_words = ["support", "security", "service", "help", "account", "update"]

ambiguous_rows = []

for _ in range(int(len(df) * 0.08)):  # 8% noise
    brand = random.choice(brands)
    word = random.choice(generic_words)
    tld = random.choice([".com", ".net", ".org", ".co"])
    
    url = f"https://{brand}-{word}{tld}/account/overview"
    
    # Randomly assign conflicting label
    label = random.choice([
        "legitimate",
        "phishing",
        "job_scam",
        "loan_scam"
    ])
    
    ambiguous_rows.append({"url": url, "label": label})

noise_df = pd.DataFrame(ambiguous_rows)

df_noisy = pd.concat([df, noise_df], ignore_index=True)

print("Old size:", len(df))
print("New size:", len(df_noisy))

df_noisy.to_csv(DATA_PATH, index=False)

print("Noise injected successfully.")
