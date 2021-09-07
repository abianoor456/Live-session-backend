export interface Room {
    id: string;
    password: string;
}

export interface RoomData {
    [key: string]: Room;
}