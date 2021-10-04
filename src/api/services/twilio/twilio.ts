
import { room, TwilioRoom } from "../../lib/keyValue";
import { tokenGenerator } from "./tokenGenerator";
import cryptoRandomString from 'crypto-random-string';

const color = require('colors')

export class TwilioService {

    private rooms: TwilioRoom = {}

    constructor(private accountSid: string | undefined, private authToken: string | undefined) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.addDummy();
        this.logRooms();

        
    }

    addDummy(){
        const room: room={
            sid: 'RM3501a77604f61e5ae76b316c802c5e2c',
            status: 'in-progress',
            accountSid: 'ACb29af0746a3fe28c38e04b42e467da6b',
            uniqueName: 'room19',
            maxParticipants: 50,
            password: '6ed0b7'
          }
          this.addRoom(room, room.uniqueName);
    }

    logRooms(){
        console.log(this.rooms);
    }

    addRoom(room: room, name: string) {
        if (!this.rooms[name]) {
            this.rooms[name] = room;
        }
        else {
            console.log(`The room with name ${name} already exists`);
        }
    }
    
    generatePassword(name: string) {
        return cryptoRandomString(6);
      }

    getRoom(name: string) {
        if (this.rooms[name]) {
            return this.rooms[name];
        }
        else{
            console.log(`This room does not exist`)
        }
    }

     findRoom(password: string) :  { Room: room; AccessToken: string | undefined; } {
        let room: room = {
            sid: '',
            status: '',
            accountSid: '',
            uniqueName: '',
            maxParticipants: 0,
            password:''
        }
        Object.keys(this.rooms).map(key => {
          let temp = this.rooms[key];
          if(temp.password == password){
            room= temp;
          }
        });
        const accessToken: string| undefined= this.getToken(room.uniqueName)?.token
        return {Room: room, AccessToken: accessToken };
      }

    async createRoom(name: string): Promise<room> {
        const client = require('twilio')(this.accountSid, this.authToken);
        let Room: room = {
            sid: '',
            status: '',
            accountSid: '',
            uniqueName: '',
            maxParticipants: 0,
            password:''
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
                sid: room.sid,
                status: room.status,
                dateCreated: room.dateCreated,
                accountSid: room.accountSid,
                uniqueName: room.uniqueName,
                maxParticipants: room.maxParticipants,
                password: password
            }
            this.addRoom(Room, name);
            this.logRooms();

        } catch (error) {
            console.log(color.red.inverse(`error: ${error}`))
        }
        return Room;
    }

    getToken(name: string): {token: string, identity: string} | undefined{
        const room= this.getRoom(name);
        if(room){
            const token= tokenGenerator('abia',room);
            return token;
        }
        else{
            console.log(`Room does not exist`);
        }

    }


}