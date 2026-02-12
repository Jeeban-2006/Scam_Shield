import pandas as pd
import joblib
import os
import re
import numpy as np
from urllib.parse import urlparse

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler
from scipy.sparse import hstack

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw_dataset.csv")

# ---------------------------------------------------
# 🔹 Structural Feature Extractor (Improved)
# ---------------------------------------------------
def extract_structural_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path

    features = []

    # -------- DOMAIN FEATURES --------
    features.append(len(domain))                         # Domain length
    features.append(domain.count("."))                   # Dot count
    features.append(max(len(domain.split(".")) - 2, 0))  # Subdomain depth
    features.append(domain.count("-"))                   # Hyphens in domain
    features.append(sum(c.isdigit() for c in domain))    # Digits in domain
    features.append(1 if re.match(r"\d+\.\d+\.\d+\.\d+", domain) else 0)  # IP address

    # Domain entropy
    if len(domain) > 0:
        prob = [float(domain.count(c)) / len(domain) for c in set(domain)]
        entropy = -sum(p * np.log2(p) for p in prob)
    else:
        entropy = 0
    features.append(entropy)

    # -------- PATH FEATURES --------
    features.append(len(path))                           # Path length
    features.append(sum(c.isdigit() for c in path))      # Digits in path
    features.append(path.count("-"))                     # Hyphens in path

    # 🔥 UUID / hash-like detection (important for modern apps)
    uuid_pattern = re.compile(r"[0-9a-fA-F\-]{20,}")
    features.append(1 if uuid_pattern.search(path) else 0)

    return features


# ---------------------------------------------------
# 🔹 Load Dataset
# ---------------------------------------------------
data = pd.read_csv(DATA_PATH)

print("Original shape:", data.shape)

data = data.dropna().drop_duplicates()

print("Cleaned shape:", data.shape)

print("\nClass Distribution:")
print(data["label"].value_counts())

X = data["url"]
y = data["label"]

# ---------------------------------------------------
# 🔹 TF-IDF Features (Reduced Noise)
# ---------------------------------------------------
vectorizer = TfidfVectorizer(
    analyzer="char",
    ngram_range=(3, 5),   # reduced noise
    min_df=3
)

X_tfidf = vectorizer.fit_transform(X)

# ---------------------------------------------------
# 🔹 Structural Features
# ---------------------------------------------------
struct_features = np.array([extract_structural_features(url) for url in X])

scaler = StandardScaler()
struct_features_scaled = scaler.fit_transform(struct_features)

# ---------------------------------------------------
# 🔹 Combine Features
# ---------------------------------------------------
X_combined = hstack([X_tfidf, struct_features_scaled])

# ---------------------------------------------------
# 🔹 Train-Test Split
# ---------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_combined,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# ---------------------------------------------------
# 🔹 Model
# ---------------------------------------------------
model = LogisticRegression(
    max_iter=4000,
    class_weight="balanced",
    solver="lbfgs"
)

model.fit(X_train, y_train)

# ---------------------------------------------------
# 🔹 Evaluation
# ---------------------------------------------------
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

train_accuracy = accuracy_score(y_train, y_train_pred)
test_accuracy = accuracy_score(y_test, y_test_pred)

print("\nTraining Accuracy:", round(train_accuracy * 100, 2), "%")
print("Test Accuracy:", round(test_accuracy * 100, 2), "%")

print("\nModel Evaluation (Test Set):\n")
print(classification_report(y_test, y_test_pred))

# Cross-validation
cv_scores = cross_val_score(model, X_combined, y, cv=5)

print("\n5-Fold Cross-Validation Accuracy:",
      round(cv_scores.mean() * 100, 2), "%")

# ---------------------------------------------------
# 🔹 Save Everything
# ---------------------------------------------------
joblib.dump(model, os.path.join(BASE_DIR, "model.pkl"))
joblib.dump(vectorizer, os.path.join(BASE_DIR, "vectorizer.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "scaler.pkl"))

print("\nModel trained and saved successfully!")
