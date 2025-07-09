import express, { Request, Response, Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to CholoBD Server",
  });
});

export default app;