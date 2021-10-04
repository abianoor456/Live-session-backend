import { room } from "../../lib/keyValue";



const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export function tokenGenerator(identity: any, room: room):{token: string, identity: string} {
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );
  
    // Assign identity to the token
    token.identity = identity;
  
    // Grant the access token Twilio Video capabilities
    const grant = new VideoGrant({
      room: room.uniqueName // the specific room's name
    });
    token.addGrant(grant);
  
    // Serialize the token to a JWT string
    return {
      token: token.toJwt(),
      identity: token.identity 
    };
  }
  