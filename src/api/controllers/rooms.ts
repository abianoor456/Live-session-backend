import { Request, Response, NextFunction } from "express";
import HttpException from "../lib/exception";
import { HttpStatusCode } from "../util/statusCodes";
import { red } from "colors";
const apiKey = process.env.TOKBOX_API_KEY;
const apiSecret = process.env.TOKBOX_API_SECRET;


exports.getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const password: string = req.params.password;

        global.services.tokbox.getRoom({
            roomName: password,
            errorFunction: (error: Error) => {
                next(new HttpException(HttpStatusCode.INTERNAL_SERVER, error.message));
                return;
            },
            callbackFunction: (apiKey: string, sessionId: string, token: string, roomPassword: string) => {
                res.status(200).json({
                    apiKey,
                    sessionId,
                    token,
                    password: roomPassword,
                });
                return;
            },
        });
    } catch (error) {
        console.log(error);
        next(new HttpException(HttpStatusCode.INTERNAL_SERVER, "Something went wrong in the API Controller!"));
    }
}

exports.createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const roomName: string = req.params.name;

        await global.services.tokbox.createRoom({
            roomName: roomName,
            errorFunction: (error: Error) => {
                next(new HttpException(HttpStatusCode.INTERNAL_SERVER, error.message));
                return;
            },
            callbackFunction: (apiKey: string, sessionId: string, token: string, roomPassword: string) => {
                res.status(200).json({
                    apiKey,
                    sessionId,
                    token,
                    password: roomPassword,
                });
                return;
            },
        });
    } catch (error) {
        console.log(error);
        next(new HttpException(HttpStatusCode.INTERNAL_SERVER, "Something went wrong in the API Controller!"));
    }
}