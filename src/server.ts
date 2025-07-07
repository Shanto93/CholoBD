import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

const port = 5000;

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://choloBD:bcSulm3y1soyMvGm@cluster0.tuf9wrv.mongodb.net/choloBD?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("CholoBD is connected");

    server = app.listen(port, () => {
      console.log(`CholoBD app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();