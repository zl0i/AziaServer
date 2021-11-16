import express from "express";
import { TypeORMError } from "typeorm";
import { HttpError } from "./errors";

const IS_DEV = process.env['NODE_ENV'] == 'dev'

export default class HttpErrorHandler {
    static handle(error: any, res: express.Response) {
        console.error(error)
        if (error instanceof HttpError) {
            res.status(error.code).json({
                result: 'error',
                mesage: error.message
            });
        } else if (error instanceof TypeORMError) {
            res.status(500).json({
                result: 'error',
                message: IS_DEV ? 'DB error' : error.message
            })
        } else {
            res.status(500).json({
                result: 'error',
                message: IS_DEV ? 'Internal Server Error' : error.message
            })
        }
    }
}