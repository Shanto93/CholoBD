import mongoose from "mongoose";
import type { IDivision } from "./division.interface";

const divisionSchema = new mongoose.Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Division = mongoose.model<IDivision>("Division", divisionSchema);
