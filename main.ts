import dotenv from "dotenv";
dotenv.config();

import type { NextFunction, Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as swaggerUI from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./build/routes";
import * as swaggerJson from "./build/swagger.json";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

RegisterRoutes(app);

app.use(
  ["/openapi", "/docs", "/swagger"],
  swaggerUI.serve,
  swaggerUI.setup(swaggerJson)
);

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});

app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }

  next();
});

const PORT = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
