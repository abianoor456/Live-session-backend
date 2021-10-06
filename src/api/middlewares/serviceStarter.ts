import { NextFunction, request, Request, Response } from 'express';
import OpenTok from 'opentok';
import OpenTokHandler from '../services/tokbox/tokbox';
import HttpException from '../lib/exception';
import { HttpStatusCode } from '../util/statusCodes';
import { blue, red, yellow } from 'colors';
import { TwilioHandler } from '../services/twilio/twilio';
import { Handler } from '../services/handler';
require('dotenv').config();

const apiKey = process.env.TOKBOX_API_KEY;
const apiSecret = process.env.TOKBOX_API_SECRET;

const twilioAccountId= process.env.TWILIO_ACCOUNT_SID;
const authToken= process.env.AUTH_TOKEN

function checkKeys(){
    if(!(apiKey && apiSecret)){
        return false;
    }
    console.log("API Key: " + apiKey);
    console.log("API Secret: " + apiSecret);
    return true;
}

function twilioKeys(){
    if(!(twilioAccountId && authToken)){
        return false;
    }
    console.log("Account ID: " + twilioAccountId);
    console.log("Auth Token: " + authToken);
    return true;
}
 
function serviceSetup(req: Request, res: Response, next: NextFunction) {
    const handler= new Handler();
  switch(req.headers.service){

      case 'tokbox':{
       
        if(checkKeys()){
            if(global.services.tokbox){
                console.log(blue.inverse("Opentok Continued!"));
               // global.services.tokbox.logRooms();
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

      case 'twilio':{
        if(twilioKeys()){
            if(global.services.twilio){
                console.log(blue.inverse("Twilio Continued!"));
                //global.services.twilio.logRooms();
            }
            else{
                global.services.twilio = new TwilioHandler(twilioAccountId, authToken);;
                console.log(red.inverse("Twilio Initialized!"));
            }
            next();
            return;
        }
      }


      default:{
        next(new HttpException(HttpStatusCode.BAD_REQUEST, "Service header not specified in request!"));
        return;
      }
  }
  next();
}
 
export default serviceSetup;