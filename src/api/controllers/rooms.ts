import { Request, Response, NextFunction } from "express";
import HttpException from "../lib/exception";
import { HttpStatusCode } from "../util/statusCodes";
import { red } from "colors";
const apiKey = process.env.TOKBOX_API_KEY;
const apiSecret = process.env.TOKBOX_API_SECRET;


exports.getSession = async (req: Request, res: Response, next: NextFunction) => {

    const password: string = req.params.password;
    switch (req.headers.service) {
        case 'tokbox': {

            try {

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

        case 'twilio': {
            //const roomName: string = req.params.name;
            if (global.services.twilio) {
                console.log(`finding room of password: ${password}`)
                const room = global.services.twilio.findRoom1(password);  
                res.status(200).json({
                    msg: `Room Retrieved`,
                    Room: room.Room,
                    Token: room.AccessToken
                });
            }

        }
    }
}

exports.createSession = async (req: Request, res: Response, next: NextFunction) => {

    const roomName: string = req.params.name;
    switch (req.headers.service) {
        case 'tokbox': {
            try {
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
        case 'twilio': {
            //const roomName: string = req.params.name;
            //console.log(color.green.inverse(`Creating room by name: ${roomName}`));
            if (global.services.twilio) {
                const room = await global.services.twilio.createRoom(roomName);
                res.status(200).json({
                    msg: `Room Created`,
                    Room: room
                });
            }

        }
    }
}