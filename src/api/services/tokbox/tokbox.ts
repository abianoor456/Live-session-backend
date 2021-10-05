import OpenTok, { SessionOptions } from "opentok";
import { TokenOptions } from "opentok";
import { RoomData, Room } from "../../lib/keyValue";
import { sessionOptions, otErrorFunction, otCallbackFunction } from "./types";
import cryptoRandomString from 'crypto-random-string';
import { blue, green } from "colors";
import { Roles } from "./roles";
import HttpException from "../../lib/exception";
import { Handler } from "../handler";

class OpenTokHandler extends Handler {
    private opentok: OpenTok;

    constructor(private apiKey: string, private apiSecret: string) {
      super();
      this.opentok = new OpenTok(apiKey, apiSecret);
    }

    private async createRoom(options: sessionOptions) {
      const { roomName, callbackFunction, errorFunction } = options;
      console.log(green("Creating a new Room!"));
      if(this.rooms[roomName]){
        errorFunction(new HttpException(400,"Room name already in use!"));
        return;
      } else {
        await this.opentok.createSession({ mediaMode: "routed" }, (error, session) => {
          if (error) {
            errorFunction(error);
            return;
          }

          if (session) {
            const room: Room = {id : session.sessionId, password : this.generatePassword(roomName),type:"tokbox"};
            this.addRoom(roomName, room);
            this.logRooms();
            const tokenOptions: TokenOptions = { role: Roles.admin, data: "name=admin"};
            const token: string = this.opentok.generateToken(session.sessionId, tokenOptions);
            callbackFunction(this.apiKey, session.sessionId, token, room.password);
            return;
          }
        });
      }
    }

    private getRoom(options: sessionOptions) {
      const { roomName , callbackFunction, errorFunction } = options;
      console.log(blue("Fetching an existing room!"));
      const [room, roomname] = this.findRoom(roomName);

      if(room.id !== ""){
        const tokenOptions: TokenOptions = { role: Roles.user, data: "name=publisher"};
        const token: string = this.opentok.generateToken(room.id, tokenOptions);
        callbackFunction(this.apiKey, room.id, token, room.password);
        return;
      } else {
        errorFunction(new HttpException(400, "Room not found!"));
        return;
      }
    }

}

export default OpenTokHandler;

