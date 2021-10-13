export interface Room {
    id: string;
    password: string;
    type: string;
}

export interface RoomData {
    [key: string]: Room;
}


