import OpenTok from "opentok";
import { RoomData, Room } from "../../lib/keyValue";
import { sessionOptions, otErrorFunction, otCallbackFunction } from "./types";
import cryptoRandomString from 'crypto-random-string';
import { blue, green } from "colors";

class OpenTokHandler {
    private opentok: OpenTok;
    private rooms: RoomData = {};

    constructor(private apiKey: string, private apiSecret: string) {
        this.opentok = new OpenTok(apiKey, apiSecret);
    }

    private logRooms(){
      console.log(this.rooms);
    }

    private generatePassword(name: string) {
        return cryptoRandomString(6);
    }

    private addRoom(name: string, room: Room){
        this.rooms[name] = {id: room.id, password: room.password};
    }

    private async createSession(
        roomName: string,
        errorFunction: otErrorFunction,
        callbackFunction: otCallbackFunction ) {
        console.log(green("Creating a new Room!"));
        await this.opentok.createSession({ mediaMode: "routed" }, (error, session) => {
          if (error) {
            console.log(error);
            errorFunction(error);
            return;
          }
    
          if (session) {
            const room: Room = {id : session.sessionId, password : this.generatePassword(roomName)};
            this.addRoom(roomName, room);
            this.logRooms();
            const token: string = this.opentok.generateToken(session.sessionId);
            callbackFunction(this.apiKey, session.sessionId, token, room.password);
            return;
          }
        });
    }

    private fetchSession(roomName: string, callbackFunction: otCallbackFunction) {
        console.log(blue("Fetching an existing room!"));
        const {id , password} = this.rooms[roomName];
        const token: string = this.opentok.generateToken(id);
        callbackFunction(this.apiKey, id, token, password);
    }

    async getSession(options: sessionOptions) {
        const { roomName, callbackFunction, errorFunction } = options;
        this.logRooms();
    
        if (this.rooms[roomName]) {
          this.fetchSession(roomName, callbackFunction);
        } else {
          await this.createSession(roomName, errorFunction, callbackFunction);
        }
      }
}

export default OpenTokHandler;

