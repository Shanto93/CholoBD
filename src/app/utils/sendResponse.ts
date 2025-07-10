import type { Response } from "express";

interface IMeta{
    total: number;
}

interface IResponseData<T>{
    statuscode: number,
    message: string,
    success: boolean,
    meta?: IMeta
    data: T
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
    res.status(data.statuscode).json({
        message: data.message,
        success: data.success,
        meta: data.meta,
        data: data.data,
    });
};