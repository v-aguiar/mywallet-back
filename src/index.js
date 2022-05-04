import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";

import joi from "joi";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
  const mongoClient = new MongoClient(proccess.env.URL_MONGODB);
  try {
    mongoClient.connect();
    const db = mongoClient.db("mywallet-api");

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(422);
  }
});

app.post("/sign-in", async (req, res) => {
  const mongoClient = new MongoClient(proccess.env.URL_MONGODB);
  try {
    mongoClient.connect();
    const db = mongoClient.db("mywallet-api");

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(422);
  }
});

app.listen(5000, () => {
  console.log(
    chalk.bold.greenBright("\n🚀 Server is running!") +
      chalk.bold.cyanBright("\n\nListening on port 5000...\n") +
      chalk.bold.magenta("http://localhost:5000\n")
  );
});
