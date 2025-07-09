import { Request, Response } from "express";
import httpstatus from "http-status-codes";

const notFound = (req: Request, res: Response) => {
  res.status(httpstatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
  });
};
export default notFound;
