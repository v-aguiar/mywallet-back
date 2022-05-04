import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";

import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chalk from "chalk";

import { stripHtml } from "string-strip-html";
import { user_schema, transaction_schema } from "./schemas/schemas.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URL || "mongodb://27017"
  );

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
    await mongoClient.connect();
    const db = mongoClient.db("mywallet-api");

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
      mongoClient.close();
      return;
    }

    const mongoUser = await db.collection("users").insertOne(user);

    res.sendStatus(201);
    mongoClient.close();
  } catch (e) {
    console.error(e);
    res.sendStatus(422);
    mongoClient.close();
  }
});

app.post("/sign-in", async (req, res) => {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URL || "mongodb://27017"
  );
  const { email } = req.body;
  const { password } = req.headers;

  try {
    await mongoClient.connect();
    const db = mongoClient.db("mywallet-api");

    const registeredUser = await db.collection("users").findOne({ email });

    if (
      registeredUser &&
      bcrypt.compareSync(password, registeredUser.password)
    ) {
      res.status(200).send({ token: registeredUser._id });
      mongoClient.close();
      return;
    } else {
      console.error("⚠ Email or password is incorrect!");
      res.sendStatus(403);
      mongoClient.close();
      return;
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(422);
    mongoClient.close();
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    chalk.bold.greenBright("\n🚀 Server is running!") +
      chalk.bold.cyanBright("\n\nListening on port 5000...\n") +
      chalk.bold.magenta("http://localhost:5000\n")
  );
});
