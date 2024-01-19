import "dotenv/config";
import BCRYPT from "bcrypt";

exports.hash_string = (plaintext: string): string => {
  return BCRYPT.hashSync(
    plaintext,
    parseInt(process.env.BCRYPT_NUMBER_OF_ROUNDS!)
  );
};
