import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";

dotenv.config();

if (process.env.TOKEN_SIGN_SECRET === undefined) {
  throw new Error("TOKEN_SIGN_SECRET is undefined");
}

export default expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET,
  algorithms: ["HS256"],
  function(err, decoded) {
    console.log("Error JWT", err);
    console.log("Error JWT, decoded value >>", decoded);
  },
});
