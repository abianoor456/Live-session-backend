import { Room, RoomData } from "../lib/keyValue";
import cryptoRandomString from 'crypto-random-string';


export class Handler{
    protected rooms: RoomData = {};

    constructor(){
      console.log('Super initialised')
    }
    protected logRooms(){
      console.log(this.rooms);
    }

    protected generatePassword(name: string) {
      return cryptoRandomString(6);
    }

    protected addRoom(name: string, room: Room){
      this.rooms[name] = {id: room.id, password: room.password, type:room.type};
    }

    protected findRoom(password: string) : [room:Room, roomName: string] {
      let temp: Room = {id:"", password:"", type:""};
      let roomName=''
      Object.keys(this.rooms).forEach(key => {
        temp = this.rooms[key];
        if(temp.password == password){
          roomName= key;
          return [temp,roomName];
        }
      });
      return [temp,roomName];
    }

    protected findRoombyName(name: string) {
      if (this.rooms[name]) {
          return this.rooms[name];
      }
      else{
          console.log(`This room does not exist`)
      }
    }

    protected roomExists(name: string, type: string): boolean{
      if(this.rooms[name]){
        if(this.rooms[name].type==type){
          return true;
        }
        return false;
      }
      return false;

    }
    

}