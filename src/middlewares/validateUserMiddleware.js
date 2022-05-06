import { stripHtml } from "string-strip-html";

import { user_schema } from "../models/schemas.js";

export async function validateUserInput(req, res, next) {
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

  next();
}
