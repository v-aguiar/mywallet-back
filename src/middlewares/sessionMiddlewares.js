import db from "../db/db.js";

export default async function validateSession(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  const validateUserSession = await db
    .collection("sessions")
    .findOne({ token });
  if (!validateUserSession) {
    return res.status(401).send("⚠ Expired session!\nNew login required!");
  }

  next();
}
