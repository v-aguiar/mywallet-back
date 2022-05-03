import express, { json } from "express";

import joi from "joi";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.listen(5000, () => {
  console.log(
    chalk.bold.greenBright("\n🚀 Server is running!") +
      chalk.bold.cyanBright("\n\nListening on port 5000...\n") +
      chalk.bold.magenta("http://localhost:5000\n")
  );
});
