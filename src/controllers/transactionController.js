import { ObjectId } from "mongodb";
import dayjs from "dayjs";

import { transaction_schema } from "../models/schemas.js";
import db from "../db/db.js";

export async function addTransaction(req, res) {
  const { amount, description, type } = req.body;
  const { token } = req.headers;

  // validate inputs with joi schema
  const validateTransaction = transaction_schema.validate(
    //type can only be "expense" or "income"
    { amount, description, type },
    { abortEarly: false }
  );
  if (validateTransaction.error) {
    console.error(validateTransaction.error.message);
    res.status(422).send("⚠  Invalid data!");
    return;
  }

  try {
    // TODO validate if given token matches any previously registered user._id
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
    console.error("\n⚠ Couldn't add transaction!\n", e);
    res.send(422);
  }
}

export async function getTransactions(req, res) {
  const { token } = req.headers;

  //TODO get transactions if token is valid

  try {
    db.collection("transactions").find({}).filter({});
  } catch (e) {
    console.error("\n⚠ Couldn't reach transactions!\n", e);
    res.send(422);
  }
}
