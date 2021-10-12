export type twilioCallbackFunction = (
    apiKey: string,
    sessionId: string,
    token: string,
    password: string,
    identity: string
  ) => void;
  
  
  export type twilioErrorFunction = (error: Error) => void;
  
  export interface twilioSessionOptions {
    roomName: string;
    userName: string | string[];
    errorFunction: twilioErrorFunction;
    callbackFunction: twilioCallbackFunction;
  }
  