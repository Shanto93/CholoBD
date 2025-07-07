import express, { Request, Response, Application } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to CholoBD Server",
  });
});

export default app;
