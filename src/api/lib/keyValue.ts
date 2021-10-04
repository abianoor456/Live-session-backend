export interface Room {
    id: string;
    password: string;
}

export interface RoomData {
    [key: string]: Room;
}

/* can genralise this more*/
export interface room{
    sid: string,
    status: string, //in progress or complete
    dateCreated?: Date,  
    accountSid: string, //owner
    uniqueName: string,
    maxParticipants: number,
    password: string
}

export interface TwilioRoom {
    [key: string]: room;
}