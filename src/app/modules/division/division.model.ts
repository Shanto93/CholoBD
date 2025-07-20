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
      // required: true,
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

divisionSchema.pre("save", async function (next) {
  if (this.name) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let count = 0;
    while (await Division.exists({ slug })) {
      slug = `${baseSlug}-division-${++count}`;
    }

    this.slug = slug;
  }

  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<IDivision>;
  if (division.name) {
    const baseSlug = division.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let count = 0;
    while (await Division.exists({ slug })) {
      slug = `${baseSlug}-division-${++count}`;
    }

    division.slug = slug;
  }
  this.setUpdate(division);
  next();
});

export const Division = mongoose.model<IDivision>("Division", divisionSchema);
