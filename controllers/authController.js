import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcrypt";

import db from "../db/db.js";

export async function signUp(req, res) {
  const { name, email } = req.body;
  const { password } = req.headers;

  try {
    const user = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    };

    // Make sure no users with the same email are allowed in the database
    const registeredUser = await db.collection("users").findOne({ email });
    if (registeredUser) {
      console.error("⚠ E-mail already registered!");
      res.sendStatus(403);
      return;
    }

    await db.collection("users").insertOne(user);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(422);
  }
}

export async function signIn(req, res) {
  const { email } = req.body;
  const { password } = req.headers;
  try {
    const registeredUser = await db.collection("users").findOne({ email });
    if (
      registeredUser &&
      bcrypt.compareSync(password, registeredUser.password)
    ) {
      const token = uuidv4();

      await db.collection("sessions").insertOne({
        token,
        userId: registeredUser._id,
        timestamp: Date.now(),
      });

      res.status(200).send({ token });
      return;
    } else {
      console.error("⚠ Email or password is incorrect!");
      res.sendStatus(403);
      return;
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(422);
  }
}
