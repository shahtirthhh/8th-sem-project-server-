import "dotenv/config";
import BCRYPT from "bcrypt";
import JWT from "jsonwebtoken";

exports.generate_token = (user: { email: string; _id: any }): string => {
  const token = JWT.sign(
    {
      email: user.email,
      _id: user._id.toString(),
    },
    process.env.TOKEN_GENERATION_SECRET_KEY!,
    { expiresIn: "1h" }
  );
  return token;
};

exports.password_matcher = (
  plaintext: string,
  hashedValue: string
): boolean => {
  return BCRYPT.compareSync(plaintext, hashedValue);
  //   Plaintext entered by the user, encrypted string  stored in the database
};
