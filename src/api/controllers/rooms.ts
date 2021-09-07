import { Request, Response, NextFunction } from "express";
import HttpException from "../lib/exception";
import { HttpStatusCode } from "../util/statusCodes";
import OpenTokHandler from "../services/tokbox/tokbox";
import { red } from "colors";
const apiKey = process.env.TOKBOX_API_KEY;
const apiSecret = process.env.TOKBOX_API_SECRET;
let opentok: OpenTokHandler;

if(!(apiKey && apiSecret)){
    new HttpException(HttpStatusCode.BAD_REQUEST, "API Key and API Secret not specified!");
}
else{
    console.log(red.inverse("OpenTok Initialized!"));
    opentok = new OpenTokHandler(apiKey!, apiSecret!);
}

exports.test = (req: Request, res: Response) => {
    res.status(200).json({data: `TEST SUCCESSFULL!`});
}

exports.getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const roomName: string = req.params.name;

        await opentok.getSession({
            roomName: roomName,
            errorFunction: (error) => {
                next(new HttpException(HttpStatusCode.INTERNAL_SERVER, error.message));
            },
            callbackFunction: (apiKey, sessionId, token, roomPassword) => {
                res.status(200).json({
                apiKey,
                sessionId,
                token,
                password: roomPassword,
                });
            },
        });
    } catch (error) {
        console.log(error);
        next(new HttpException(HttpStatusCode.INTERNAL_SERVER, "Something went wrong in the API Controller!"));
    }
}