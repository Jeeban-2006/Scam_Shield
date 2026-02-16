import ssl
import socket
from urllib.parse import urlparse
from .ml.predict import predict_url


SUSPICIOUS_TLDS = (".tk", ".xyz", ".ml", ".ga", ".cf", ".gq", ".work", ".top")
SUSPICIOUS_KEYWORDS = ["login", "verify", "secure", "account", "bank", "pay", "update"]


def check_ssl(domain: str, timeout: int = 5) -> bool:
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=timeout) as sock:
            with context.wrap_socket(sock, server_hostname=domain):
                return True
    except Exception:
        return False


def validate_url(url: str) -> dict:
    """
    Hybrid URL validation:
    - Rule-based detection
    - ML-based classification
    - Corrected weighted fusion scoring
    """

    result = {
        "is_valid": False,
        "is_safe": True,
        "domain": None,
        "ssl_valid": False,
        "risk_level": "SAFE",
        "risk_score": 0,
        "red_flags": [],
        "analysis": "",
        "ml_prediction": None,
        "ml_confidence": None,
        "ml_patterns": [],
    }

    url = (url or "").strip()

    # Basic validation
    if not url:
        result["red_flags"].append("URL is required")
        result["analysis"] = "Invalid or missing URL."
        return result

    if not url.startswith(("http://", "https://")):
        result["red_flags"].append("URL must start with http:// or https://")
        result["analysis"] = "Invalid URL scheme."
        return result

    try:
        parsed = urlparse(url)
        domain = (parsed.netloc or "").lower().split(":")[0]

        if not domain:
            result["red_flags"].append("Invalid domain")
            result["analysis"] = "Could not parse domain."
            return result

        result["domain"] = domain
        result["is_valid"] = True

    except Exception as e:
        result["red_flags"].append(f"Invalid URL: {str(e)}")
        result["analysis"] = "URL could not be parsed."
        return result

    rule_score = 0

    # HTTPS / SSL Check
    if parsed.scheme == "https":
        result["ssl_valid"] = check_ssl(domain)
        if not result["ssl_valid"]:
            result["red_flags"].append("SSL certificate invalid or missing")
            rule_score += 25
    else:
        result["red_flags"].append("No HTTPS encryption")
        rule_score += 30

    # Suspicious TLD
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            result["red_flags"].append(f"Suspicious domain extension ({tld})")
            rule_score += 35
            break

    # Suspicious keywords
    path_lower = (parsed.path or "").lower()
    for kw in SUSPICIOUS_KEYWORDS:
        if kw in path_lower or kw in domain:
            result["red_flags"].append(f"Suspicious keyword detected ({kw})")
            rule_score += 10
            break

    rule_score = min(100, rule_score)

    # 🔹 ML-based classification
    ml_score = 0

    try:
        ml_result = predict_url(url)

        ml_prediction = ml_result["prediction"]
        ml_confidence = ml_result["confidence"]
        ml_patterns = ml_result.get("top_patterns", [])

        result["ml_prediction"] = ml_prediction
        result["ml_confidence"] = ml_confidence
        result["ml_patterns"] = ml_patterns

        # 🔥 IMPORTANT FIX:
        if ml_prediction != "legitimate":
            result["red_flags"].append(f"ML detected: {ml_prediction}")
            ml_score = ml_confidence  # only risky if not legitimate
        else:
            ml_score = 0  # legitimate = no ML risk

    except Exception:
        result["red_flags"].append("ML analysis unavailable")

    # 🔥 Correct Weighted Fusion
    final_score = int((rule_score * 0.7) + (ml_score * 0.3))
    final_score = min(100, final_score)

    result["risk_score"] = final_score

    # Final decision
    if final_score >= 70:
        result["risk_level"] = "DANGEROUS"
        result["is_safe"] = False
        result["analysis"] = (
            f"High risk detected. ML classified this as '{result['ml_prediction']}' "
            f"with {result['ml_confidence']}% confidence."
        )
    elif final_score >= 40:
        result["risk_level"] = "SUSPICIOUS"
        result["is_safe"] = False
        result["analysis"] = (
            f"This link appears suspicious. ML flagged: '{result['ml_prediction']}'."
        )
    else:
        result["risk_level"] = "SAFE"
        result["analysis"] = (
            "No major red flags detected. Always verify before clicking unknown links."
        )

    return result
