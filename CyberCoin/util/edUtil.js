const crypto = require('crypto');
const elip = require('elliptic');
const edDSA = elip.eddsa;
const ed5 = new edDSA('ed25519');

const saltGenerator = stringLength => {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex')
};
const salt = new saltGenerator(64);

class edUtil{

  static genSecret(password){

    let secret = crypto.pbkdf2Sync(password,salt,10000,512, 'sha512').toString('hex');

    return secret;
  }

  static genKeyPair(secret){

    let keyPair = ed5.keyFromSecret(secret);

    return keyPair;
  }

  static signHash(keyPair, msgHash){

    let signature = keyPair.sign(msgHash).toHex().toLowerCase();

    return signature;
  }

  static verifySignature(publicKey, signature, msgHash){

    let key = ed5.keyFromPublic(publicKey, 'hex');
    let verified = key.verify(msgHash,signature);

    return verified;
  }

  static toHex(data) {
    return elliptic.utils.toHex(data);
  }


}

module.exports = edUtil;

