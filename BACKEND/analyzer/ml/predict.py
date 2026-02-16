import joblib
import os
import numpy as np
import re
from urllib.parse import urlparse
from scipy.sparse import hstack

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------
# 🔹 Load model artifacts
# ---------------------------------------------------
model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))


# ---------------------------------------------------
# 🔹 MUST MATCH train_model.py EXACTLY
# ---------------------------------------------------
def extract_structural_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path

    features = []

    # -------- DOMAIN FEATURES --------
    features.append(len(domain))                         # domain length
    features.append(domain.count("."))                   # dot count
    features.append(max(len(domain.split(".")) - 2, 0))  # subdomain depth
    features.append(domain.count("-"))                   # hyphens in domain
    features.append(sum(c.isdigit() for c in domain))    # digits in domain
    features.append(1 if re.match(r"\d+\.\d+\.\d+\.\d+", domain) else 0)  # IP check

    # Domain entropy
    if len(domain) > 0:
        prob = [float(domain.count(c)) / len(domain) for c in set(domain)]
        entropy = -sum(p * np.log2(p) for p in prob)
    else:
        entropy = 0
    features.append(entropy)

    # -------- PATH FEATURES --------
    features.append(len(path))                           # path length
    features.append(sum(c.isdigit() for c in path))      # digits in path
    features.append(path.count("-"))                     # hyphens in path

    # 🔥 UUID / hash-like detection (MUST match training)
    uuid_pattern = re.compile(r"[0-9a-fA-F\-]{20,}")
    features.append(1 if uuid_pattern.search(path) else 0)

    return features


# ---------------------------------------------------
# 🔹 Prediction Function
# ---------------------------------------------------
def predict_url(url):
    """
    Returns:
    - prediction (label)
    - confidence (%)
    - top_patterns (TF-IDF features only)
    """

    try:
        # 1️⃣ TF-IDF features
        tfidf_features = vectorizer.transform([url])

        # 2️⃣ Structural features
        struct_features = np.array([extract_structural_features(url)])
        struct_features_scaled = scaler.transform(struct_features)

        # 3️⃣ Combine features
        url_vector = hstack([tfidf_features, struct_features_scaled])

        # 4️⃣ Predict
        prediction = model.predict(url_vector)[0]
        probabilities = model.predict_proba(url_vector)[0]
        confidence = float(round(np.max(probabilities) * 100, 2))

        # ---------------------------------------------------
        # 🔹 Explainable AI (TF-IDF only)
        # ---------------------------------------------------
        feature_names = vectorizer.get_feature_names_out()
        class_index = list(model.classes_).index(prediction)

        # Ignore structural weights for explanation
        tfidf_coefs = model.coef_[class_index][:len(feature_names)]

        top_indices = np.argsort(tfidf_coefs)[-5:]
        top_features = [feature_names[i] for i in top_indices]

        return {
            "prediction": prediction,
            "confidence": confidence,
            "top_patterns": top_features
        }

    except Exception as e:
        return {
            "prediction": "unknown",
            "confidence": 0.0,
            "top_patterns": [],
            "error": str(e)
        }
