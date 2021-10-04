import "express"; // Modifies global namespace, so include it!
import { TwilioService } from "./api/services/twilio/twilio";

declare global {
    namespace Express {
        interface Request {
            token: string,
            UserID: string
        }
    }

    var services: {
        tokbox: any;
        twilio: TwilioService | null;
    };
}

export { };