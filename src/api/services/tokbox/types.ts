export type otCallbackFunction = (
  apiKey: string,
  sessionId: string,
  token: string,
  password: string
) => void;


export type otErrorFunction = (error: Error) => void;

export interface sessionOptions {
  roomName: string;
  errorFunction: otErrorFunction;
  callbackFunction: otCallbackFunction;
}


