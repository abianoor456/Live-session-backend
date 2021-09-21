import { NextFunction, request, Request, Response } from 'express';
import OpenTok from 'opentok';
import OpenTokHandler from '../services/tokbox/tokbox';
import HttpException from '../lib/exception';
import { HttpStatusCode } from '../util/statusCodes';
import { blue, red } from 'colors';
require('dotenv').config();

const apiKey = process.env.TOKBOX_API_KEY;
const apiSecret = process.env.TOKBOX_API_SECRET;

function checkKeys(){
    if(!(apiKey && apiSecret)){
        return false;
    }
    console.log("API Key: " + apiKey);
    console.log("API Secret: " + apiSecret);
    return true;
}
 
function serviceSetup(req: Request, res: Response, next: NextFunction) {
  switch(req.headers.service){
      case 'tokbox':{
        if(checkKeys()){
            if(global.services.tokbox){
                console.log(blue.inverse("Opentok Continued!"));
                global.services.tokbox.logRooms();
            }
            else{
                global.services.tokbox = new OpenTokHandler(apiKey!, apiSecret!);
                console.log(red.inverse("Opentok Initialized!"));
            }
            next();
            return;
        }
        else{
            next(new HttpException(HttpStatusCode.BAD_REQUEST, "API Key and API Secret not specified!"));
            return;
        }
        break;
      }
      default:{
        next(new HttpException(HttpStatusCode.BAD_REQUEST, "Service header not specified in request!"));
        return;
      }
  }
  next();
}
 
export default serviceSetup;