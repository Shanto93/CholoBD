/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { EnvConfig } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(EnvConfig.DB_URL);
    console.log("CholoBD is connected");

    server = app.listen(EnvConfig.PORT, () => {
      console.log(`CholoBD app listening on port ${EnvConfig.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Error...Server is Shutting Down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("Forgot to catch this promise"));

process.on("uncaughtException", (error) => {
  console.log("UnCaught Exception Error...Server is Shutting Down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// throw new Error("Checking Uncaught Exception Error");

process.on("SIGTERM", () => {
  console.log("SIGTERM Signal received...Server is Shutting Down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});