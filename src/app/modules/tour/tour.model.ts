import mongoose from "mongoose";
import type { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new mongoose.Schema<ITourType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const TourType = mongoose.model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new mongoose.Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      trim: true,
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    costFrom: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    included: {
      type: [String],
      trim: true,
      default: [],
    },
    excluded: {
      type: [String],
      trim: true,
      default: [],
    },
    amenities: {
      type: [String],
      trim: true,
      default: [],
    },
    tourPlan: {
      type: [String],
      trim: true,
      default: [],
    },
    maxGuests: {
      type: Number,
      min: 1,
    },
    minAge: {
      type: Number,
      min: 0,
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tourSchema.pre("save", async function (next) {
  if (this.title) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-tour`;

    let count = 0;
    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-division-${++count}`;
    }

    this.slug = slug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    const baseSlug = tour.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-tour`;

    let count = 0;
    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-division-${++count}`;
    }

    tour.slug = slug;
  }
  this.setUpdate(tour);
  next();
});

export const Tour = mongoose.model<ITour>("Tour", tourSchema);
