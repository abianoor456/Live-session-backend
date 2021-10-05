
import {  Room, RoomData } from "../../lib/keyValue";
import { tokenGenerator } from "./tokenGenerator";
import cryptoRandomString from 'crypto-random-string';
import { Handler } from "../handler";
import { sessionOptions } from "../tokbox/types";
;
import { blue, green } from "colors";

const color = require('colors')

export class TwilioHandler extends Handler {

    //private rooms: RoomData = {}

    constructor(private accountSid: string | undefined, private authToken: string | undefined) {
        
        super();
        console.log('Twilio initialised')
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.addDummy();
        this.logRooms();
        
    }

    addDummy(){
        const room: Room={
            id: 'RM3501a77604f61e5ae76b316c802c5e2c',
            password: '6ed0b7',
            type:"Twilio"
          }
          this.addRoom( 'room19',room);
    }

    

    getRoom(password: string) :  { Room: Room; AccessToken: string | undefined; } {
        console.log('in find room')
        let room: Room = {
            id: '',
            password:'',
            type:''
        }
        let roomName='';

        [room, roomName]= this.findRoom(password)

        const accessToken: string| undefined= this.getToken(roomName)?.token
        return {Room: room, AccessToken: accessToken };
      }

     async createRoom(name: string): Promise<Room> {
        const client = require('twilio')(this.accountSid, this.authToken);
        let Room: Room = {
            id: '',
            password:'',
            type: ''
        }
        try {
            const room = await client.video.rooms.create({
                recordParticipantsOnConnect: true,
                type: 'group',
                uniqueName: name,
                max_participants: 20
            })
            const password= this.generatePassword(name);
            Room = {
                id: room.sid,
                password: password,
                type:'twilio'
            }
            this.addRoom( name,Room);
            this.logRooms();

        } catch (error) {
            console.log(color.red.inverse(`error: ${error}`))
        }
        return Room;
    }

    async createRoom2(options: sessionOptions){
        const { roomName, callbackFunction, errorFunction } = options;
      console.log(green("Creating a new Room!"));

    }

    getToken(name: string): {token: string, identity: string} | undefined{
        const room= this.findRoombyName(name);
        if(room){
            const token= tokenGenerator('abia',name);
            return token;
        }
        else{
            console.log(`Room does not exist`);
        }

    }


}