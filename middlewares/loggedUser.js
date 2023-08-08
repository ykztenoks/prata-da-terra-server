import { User } from "../models/user.model";

export default async function loggedUser(req, res, next) {
  try {
    const userData = req.auth;

    const user = await User.findOne({ _id: userData._id }, { password: 0 });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
