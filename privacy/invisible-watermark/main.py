import numpy as np
from PIL import Image
import pywt
from scipy.linalg import svd, diagsvd
from hashlib import sha256

def _img_to_grayscale_array(img):
    img = img.convert('L')
    arr = np.array(img).astype(np.float32)
    return arr

def _array_to_img(arr):
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, mode='L')

def string_to_bits(s, n_bits=256):
    h = sha256(s.encode('utf-8')).digest()
    bits = np.unpackbits(np.frombuffer(h, dtype=np.uint8))
    return bits[:n_bits]

def bits_to_string(bits):
    bytes_ = np.packbits(bits)
    return bytes_.tobytes()

def embed_watermark(cover_img_pil, watermark_bits, wavelet='db2', level=2, alpha=2.0):
    arr = _img_to_grayscale_array(cover_img_pil)
    coeffs = pywt.wavedec2(arr, wavelet=wavelet, level=level)
    target_level = 1
    LH, HL, HH = coeffs[target_level]
    subband = HL
    m, n = subband.shape
    flat = subband.flatten()
    block_size = 8
    n_blocks = len(flat) // block_size
    max_bits = n_blocks
    bits = watermark_bits.copy()
    if len(bits) > max_bits:
        bits = bits[:max_bits]
    else:
        bits = np.concatenate([bits, np.zeros(max_bits - len(bits), dtype=np.uint8)])
    blocks = flat[:n_blocks*block_size].reshape((n_blocks, block_size))
    for i in range(n_blocks):
        block = blocks[i].reshape(int(np.sqrt(block_size)), -1) if int(np.sqrt(block_size))**2==block_size else blocks[i:i+1]
        s_len = int(np.sqrt(block_size))
        if s_len*s_len == block_size:
            B = blocks[i].reshape((s_len, s_len))
        else:
            B = blocks[i].reshape((1, block_size))
        U, S, Vt = svd(B, full_matrices=False)
        bit = bits[i]
        delta = alpha if bit == 1 else -alpha
        S_mod = S.copy()
        S_mod[0] = S_mod[0] + delta
        B_mod = (U * S_mod) @ Vt
        flat[i*block_size:(i+1)*block_size] = B_mod.flatten()[:block_size]
    subband_mod = flat.reshape(subband.shape)
    coeffs_mod = list(coeffs)
    coeffs_mod[target_level] = (LH, subband_mod, HH)
    arr_mod = pywt.waverec2(coeffs_mod, wavelet=wavelet)
    img_mod = _array_to_img(arr_mod)
    return img_mod

def extract_watermark(watermarked_img_pil, original_img_pil, n_bits_expected=256, wavelet='db2', level=2, block_size=8):
    wa = _img_to_grayscale_array(watermarked_img_pil)
    orig = _img_to_grayscale_array(original_img_pil)
    coeffs_w = pywt.wavedec2(wa, wavelet=wavelet, level=level)
    coeffs_o = pywt.wavedec2(orig, wavelet=wavelet, level=level)
    target_level = 1
    LHw, HLw, HHw = coeffs_w[target_level]
    LHo, HLo, HHo = coeffs_o[target_level]
    flat_w = HLw.flatten()
    flat_o = HLo.flatten()
    n_blocks = len(flat_w) // block_size
    bits = []
    for i in range(min(n_bits_expected, n_blocks)):
        s_len = int(np.sqrt(block_size))
        if s_len*s_len == block_size:
            Bw = flat_w[i*block_size:(i+1)*block_size].reshape((s_len, s_len))
            Bo = flat_o[i*block_size:(i+1)*block_size].reshape((s_len, s_len))
        else:
            Bw = flat_w[i*block_size:(i+1)*block_size].reshape((1, block_size))
            Bo = flat_o[i*block_size:(i+1)*block_size].reshape((1, block_size))
        Uw, Sw, Vtw = svd(Bw, full_matrices=False)
        Uo, So, Vto = svd(Bo, full_matrices=False)
        diff = Sw[0] - So[0]
        bits.append(1 if diff > 0 else 0)
    return np.array(bits[:n_bits_expected], dtype=np.uint8)

if __name__ == "__main__":
    cover_path = "D:\\Labely\\Labely\\privacy\\invisible-watermark\\cover.jpg"
    out_path = "watermarked.jpg"

    img = Image.open(cover_path).convert('L').resize((512,512))
    token = "worker42_session_2025-11-16T15:00:00Z"
    bits = string_to_bits(token, n_bits=128)
    wm_img = embed_watermark(img, bits, alpha=1.5)
    wm_img.save(out_path)

    wm_img_jpeg = Image.open(out_path).convert('L')
    wm_img_jpeg.save("watermarked_q80.jpg", quality=80)

    extracted = extract_watermark(Image.open("watermarked_q80.jpg"), img, n_bits_expected=128, block_size=16)
    ber = np.mean(extracted != bits[:len(extracted)])
    print("BER:", ber)
