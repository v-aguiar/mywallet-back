import express, { json } from "express";

import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import router from "./routes/router.js";

import db from "./db/db.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.use(router);

// ** ⚠ WARNING! ** Development/Testing purposes only. Use carefully! ** ⚠ WARNING! **
app.delete("/delete-all", async (req, res) => {
  try {
    await db.collection("users").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("transactions").deleteMany({});

    res.sendStatus(200);
  } catch (e) {
    console.error("⚠ Error deleting data!");
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    chalk.bold.greenBright("\n🚀 Server is running!") +
      chalk.bold.cyanBright("\n\nListening on port " + PORT + "...\n") +
      chalk.bold.magenta("http://localhost:" + PORT + "\n")
  );
});
