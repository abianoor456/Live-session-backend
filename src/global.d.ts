import "express"; // Modifies global namespace, so include it!
import OpenTokHandler from "./api/services/tokbox/tokbox";
import { TwilioHandler, TwilioService } from "./api/services/twilio/twilio";

declare global {
    namespace Express {
        interface Request {
            token: string,
            UserID: string
        }
    }

    var services: {
        tokbox: OpenTokHandler| null;
        twilio: TwilioHandler | null;
    };
}

export { };