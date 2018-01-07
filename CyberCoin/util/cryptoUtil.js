const crypto = require("crypto");

// prettier-ignore
class CryptoUtil {
  static hash(anyInput) {
    let anyString =
      typeof anyInput === "object" ? JSON.stringify(anyInput) : anyInput.toString();

    let anyHash = crypto
      .createHash("sha256")
      .update(anyString)
      .digest("hex");

    return anyHash;
  }

  static RandomId(size = 64) {
    return crypto.randomBytes(Math.floor(size / 2)).toString("hex");
  }
}

module.exports = CryptoUtil;
