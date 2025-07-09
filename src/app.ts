import express, {
  Request,
  Response,
  Application,
  type NextFunction,
} from "express";
import cors from "cors";
import { router } from "./app/routes";
import { EnvConfig } from "./app/config/env";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to CholoBD Server",
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    success: false,
    message: `${error.message}`,
    error,
    stack: EnvConfig.NODE_ENV === "development" ? error.stack : null,
  });
});

export default app;
