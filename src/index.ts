const express = require(`express`);
const dotenv = require(`dotenv`);
const color = require(`colors`);
const morgan = require(`morgan`);
const cors = require(`cors`);

import serviceSetup from './api/middlewares/serviceStarter';
import errorMiddleware from './api/middlewares/errorHandler';

dotenv.config();

//Initialize Globals
global.services = { tokbox: null, twilio: null};

//Middleware Setups
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan(`dev`));
const ping = require(`./api/routes/ping`);
app.use(`/ping`, ping);


app.use(serviceSetup);

//Setting up routes here
const room = require(`./api/routes/rooms`);
app.use(`/api/v1/room`, room);


//Setting up Error Handler
app.use(errorMiddleware);

//Service start on PORT
const server = app.listen(process.env.PORT, () => {
    console.log(color.yellow.inverse(`Service is running on port: ${process.env.PORT}`));
});