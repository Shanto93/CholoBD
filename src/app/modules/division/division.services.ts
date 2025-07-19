import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import type { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const isDivisionExists = await Division.findOne({ name: payload.name });
  if (isDivisionExists) {
    throw new AppError(StatusCodes.CONFLICT, "Division already exists");
  }
  const disvision = await Division.create(payload);
  return disvision;
};

const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments({});
  return {
    data: divisions,
    meta: { total: totalDivisions },
  };
};

export const DivisionServices = {
  createDivision,
  getAllDivisions,
};
