
import { Room, RoomData } from "../../lib/keyValue";
import { tokenGenerator } from "./tokenGenerator";
import cryptoRandomString from 'crypto-random-string';
import { Handler } from "../handler";
import { sessionOptions } from "../tokbox/types";
;
import { blue, green } from "colors";
import HttpException from "../../lib/exception";
import { twilioSessionOptions } from "./types";

const color = require('colors')

export class TwilioHandler extends Handler {

    constructor(private accountSid: string | undefined, private authToken: string | undefined) {

        super();
        console.log('Twilio initialised')
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.addDummy();
        this.logRooms();

    }

    addDummy() {
        const room: Room = {
            id: 'RM3501a77604f61e5ae76b316c802c5e2c',
            password: '6ed0b7',
            type: "twilio"
        }
        this.addRoom('room19', room);
    }

    getRoom(options: twilioSessionOptions) {
        const { roomName,userName, callbackFunction, errorFunction } = options;
        console.log(blue("Fetching an existing room!"));

        const [room, roomname] = this.findRoom(roomName);

        if (room.id !== "") {

            const token = this.getToken(roomname, userName);
            if (token?.token) {
                callbackFunction('', room.id, token?.token, room.password,token.identity);
                return;
            }
            else {
                errorFunction(new HttpException(400, "Acess token could not be generated"));
            }
        }
        else {
            errorFunction(new HttpException(400, "Room not found!"));
            return;
        }

    }

    async createTwilioRoom(name: string): Promise<Room> {
        const client = require('twilio')(this.accountSid, this.authToken);
        let Room: Room = {
            id: '',
            password: '',
            type: ''
        }
        try {
            const room = await client.video.rooms.create({
                recordParticipantsOnConnect: true,
                type: 'group',
                uniqueName: name,
                max_participants: 20
            })
            const password = this.generatePassword(name);
            Room = {
                id: room.sid,
                password: password,
                type: 'twilio'
            }
            this.addRoom(name, Room);
            this.logRooms();

        } catch (error) {
            console.log(color.red.inverse(`error: ${error}`))
        }
        return Room;
    }

    async createRoom(options: sessionOptions) {
        const { roomName, callbackFunction, errorFunction } = options;
        console.log(green("Creating a new Room!"));
        if (this.roomExists(roomName,'twilio')) {
            errorFunction(new HttpException(400, "Room name already in use!"));
            return;
        }
        else {
            const room: Room = await this.createTwilioRoom(roomName);
            const token = '';
            callbackFunction('', room.id, token, room.password);
            return;
        }
    }

    getToken(roomName: string, userName: string | string[]): { token: string, identity: string } | undefined {
        const room = this.findRoombyName(roomName);
        if (room) {
            const token = tokenGenerator(userName, roomName);
            return token;
        }
        else {
            console.log(`Room does not exist`);
        }

    }


}