import jwt from "jsonwebtoken";

export function generateToken(user) {
  const { _id, name, email, type } = user;

  if (process.env.TOKEN_SIGN_SECRET === undefined) {
    throw new Error("TOKEN_SIGN_SECRET is undefined");
  }

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  return jwt.sign({ _id, name, email, type }, signature, {
    expiresIn: expiration,
  });
}
