import dayjs from "dayjs";

import { transaction_schema } from "../models/schemas.js";
import db from "../db/db.js";

export async function addTransaction(req, res) {
  const { amount, description, type } = req.body;

  // validate inputs with joi schema
  const validateTransaction = transaction_schema.validate(
    // type can only be "expense" or "income"
    { amount, description, type },
    { abortEarly: false }
  );
  if (validateTransaction.error) {
    console.error(validateTransaction.error.message);
    res.status(422).send("⚠  Invalid data!");
    return;
  }

  try {
    const { userSession } = res.locals;
    const { userId } = userSession;

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      console.error("User not found!");
      res.sendStatus(401);
    }

    const transaction = {
      type,
      amount,
      userId,
      description,
      name: user.name,
      timestamp: Date.now(),
      date: dayjs().format("DD/MM"),
    };

    console.log(transaction);

    await db.collection("transactions").insertOne(transaction);
    res.sendStatus(201);
  } catch (e) {
    console.error("\n⚠ Couldn't add transaction!\n", e);
    res.sendStatus(422);
  }
}

export async function getTransactions(req, res) {
  try {
    const { userSession } = res.locals;
    const { userId } = userSession;

    // Filter transactions cronologically
    const filteredTransactions = await db
      .collection("transactions")
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();

    // Remove _id and userId from response
    filteredTransactions.forEach((transaction) => {
      delete transaction._id;
      delete transaction.userId;
    });

    res.status(200).send(filteredTransactions);
  } catch (e) {
    console.error("\n⚠ Couldn't reach transactions!\n", e);
    res.sendStatus(422);
  }
}
