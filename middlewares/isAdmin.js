export default async function isAdmin(req, res, next) {
  try {
    const user = req.user;

    if (user.role !== "ADMIN" || !user) {
      return res.status(401).json({ msg: "You are not authorized here." });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
