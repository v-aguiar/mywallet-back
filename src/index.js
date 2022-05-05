import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";

import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chalk from "chalk";

import { v4 as uuidv4 } from "uuid";
import { stripHtml } from "string-strip-html";
import { user_schema, transaction_schema } from "./models/schemas.js";

import db from "./db/db.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
  const { name, email } = req.body;
  const { password, confirm } = req.headers;

  // Validate inputs
  const validateInput = user_schema.validate({
    name: stripHtml(name).result,
    email,
    password,
    confirm,
  });
  if (validateInput.error) {
    console.error(validateInput.error.message);
    res.sendStatus(422);
    return;
  }

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
});

app.post("/sign-in", async (req, res) => {
  const { email } = req.body;
  const { password } = req.headers;

  try {
    const registeredUser = await db.collection("users").findOne({ email });

    if (
      registeredUser &&
      bcrypt.compareSync(password, registeredUser.password)
    ) {
      const token = uuidv4();

      await db
        .collection("sessions")
        .insertOne({ token, userId: registeredUser._id });

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
});

app.post("/transactions", async (req, res) => {
  const { amount, description, type } = req.body;
  const { token } = req.headers;

  // validate inputs with joi schema
  const validateTransaction = transaction_schema.validate(
    { amount, description, type },
    { abortEarly: false }
  );
  if (validateTransaction.error) {
    console.error(validateTransaction.error.message);
    res.status(422).send("⚠  Invalid data!");
    return;
  }

  try {
    // validate if given token matches any previously registered user._id
    const user = db.collection("users").findOne({ _id: new ObjectId(token) });
    if (!user) {
      console.error("Token invalid!");
      res.sendStatus(401);
    }

    const transaction = {
      type,
      amount,
      description,
      name: user.name,
      userId: token,
      timestamp: Date.now(),
      date: dayjs().format("DD/MM"),
    };

    await db.collection("transactions").insertOne(transaction);
  } catch (e) {
    console.error("\n⚠ Couldn't reach transactions!\n", e);
    res.send(422);
  }
});

app.get("/transactions", async (req, res) => {
  const { token } = req.headers;

  try {
    db.collection("transactions").find({}).filter({});
  } catch (e) {
    console.error("\n⚠ Couldn't reach transactions!\n", e);
    res.send(422);
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    chalk.bold.greenBright("\n🚀 Server is running!") +
      chalk.bold.cyanBright("\n\nListening on port 5000...\n") +
      chalk.bold.magenta("http://localhost:5000\n")
  );
});
