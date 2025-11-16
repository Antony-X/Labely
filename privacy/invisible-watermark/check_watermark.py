# watermark_checker.py
import numpy as np
from PIL import Image
from hashlib import sha256
from main import extract_watermark, string_to_bits


def check_watermark(original_path, suspect_path, token, n_bits=128, threshold=0.35):
    print("Loading images...")
    orig = Image.open(original_path).convert("L").resize((512,512))
    suspect = Image.open(suspect_path).convert("L").resize((512,512))

    print("Generating expected watermark bits...")
    expected_bits = string_to_bits(token, n_bits=n_bits)

    print("Extracting bits from suspect image...")
    extracted_bits = extract_watermark(
        suspect, orig,
        n_bits_expected=n_bits,
        block_size=8
    )

    ber = np.mean(extracted_bits != expected_bits)
    print(f"\nExtracted {len(extracted_bits)} bits")
    print(f"Bit Error Rate (BER): {ber:.3f}")

    if ber < threshold:
        print("✔️ WATERMARK DETECTED")
        print(f"Confidence: {100*(1-ber):.1f}%")
        return True, ber
    else:
        print("❌ NO VALID WATERMARK FOUND")
        print(f"Confidence: {100*(1-ber):.1f}% (too low)")
        return False, ber


if __name__ == "__main__":
    original = "D:/Labely/Labely/privacy/invisible-watermark/cover.jpg"
    suspect = "D:/Labely/Labely/privacy/invisible-watermark/cover.jpg"
    token = "worker42_session_2025-11-16T15:00:00Z"

    check_watermark(original, suspect, token, n_bits=128)
