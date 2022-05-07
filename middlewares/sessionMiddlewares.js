import db from "../db/db.js";

export default async function validateSession(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  try {
    const validateUserSession = await db
      .collection("sessions")
      .findOne({ token });
    if (!validateUserSession) {
      return res.status(401).send("⚠ Expired session!\nNew login required!");
    }

    res.locals.userSession = validateUserSession;
  } catch (error) {
    console.error("\n⚠ Couldn't add transaction!\n", e);
    res.sendStatus(422);
  }

  next();
}
