<h1>Live Session Project Back-end</h1>
<p>This project uses the Tokbox/Vonage API for conducting live Video sessions. Tokbox is a paid API and the account used for the development of this project was a trial account.</p>

<h2>Project Directory Structure</h2>

```

├── package.json
├── package-lock.json
├── src
│   ├── api
│   │   ├── controllers
│   │   │   └── rooms.ts
│   │   ├── lib
│   │   │   ├── exception.ts
│   │   │   └── keyValue.ts
│   │   ├── middlewares
│   │   │   ├── errorHandler.ts
│   │   │   └── serviceStarter.ts
│   │   ├── models
│   │   ├── routes
│   │   │   ├── index.ts
│   │   │   └── ping.ts
│   │   │   └── rooms.ts
│   │   ├── services   
│   │   │   ├── tokbox
│   │   │   │   ├── roles.ts
│   │   │   │   └── tokbox.ts
│   │   │   │   └── types.ts
│   │   │   ├── twilio
│   │   │   │   ├── tokenGenerator.ts
│   │   │   │   ├── twilio.ts
│   │   │   │   └── types.ts
│   │   │   ├── handler.ts
│   │   └── util
│   │       └── statusCodes.ts
│   ├── config
│   │   └── database.ts
│   ├── global.d.ts
│   └── index.ts
└── tsconfig.json
```

<h2>Project Design and Architecture</h2>
<p>The scope of this project has been defined to expand every now and then with the addition of newer service providers. The goal was to make as generic project structure as possible so that, if new service providers are added in it then the controller layer itself shouldn't change much. Rather, new wrapper classes should be added and then used instead.</p>
<p>The basic architecture is an extension of Express.js and follows all the methodlogy of REST structure</p>

- **index.js** is the start point of the application
- **global.d.ts** file's responsibility is to declare global variable, names as 'services' for the whole 'Express' namespace.
- **middlewares/serviceStarter.ts** inside the middleware folder specifies one of the most core approaches of this application's architecture. The idea here was that whenever a client requests some data from this application then before sending that Request to it's specific API Controller, first we determine which service the request wants to entertain i.e "tokbox" or "twilio" etc and then we initialize the globale variable "services" with the instance of the wrapper class of the specified service. For this particular project, A wrapper class for "Tokbox" service has been provided. See below for more information.
- **middlewares/errorHandler.ts** is the middleware that is used in the whole application to handle any exception. This utlizes the "lib/exception.ts" class that is responsible for returning informative error messages to the client.
- **services/tokbox.ts** is the custom made wrapper class that handles all the operation related to the "Tokbox" service provider. An instance of this class is initialized throught the above mention middleware whenever it detects the "service" key in the header section of upcoming request that matches with the value "tokbox". All the wrapper methods of this class are used in the API controller for the request and hence maintaining the structural integrity of this project.
- **services/twilio.ts** is the custom made wrapper class that handles all the operation related to the "Twilio" service provider. An instance of this class is initialized throught the above mention middleware whenever it detects the "service" key in the header section of upcoming request that matches with the value "twilio". All the wrapper methods of this class are used in the API controller for the request and hence maintaining the structural integrity of this project.
- **routes/** directory contains all the available API paths for the use of this application.

<h2>Installation and Usage</h2>
Follow the steps to get the project up and running on your local machine:

1. Clone the Project from this repository. Always check for the latest publish.
2. Create a ".env" file in the base directory of project and add your credentials and network port for the applciation in this format:
```
PORT=<Your Port>
TOKBOX_API_KEY=<Your tokbox account api key>
TOKBOX_API_SECRET=<Your tokbox account api secret>
TWILIO_API_SECRET=<Your twilio account Api secret>
TWILIO_API_KEY=<Your twilio account Api Key>
TWILIO_ACCOUNT_SID=<Your twilio account Account ID>
AUTH_TOKEN=<Your twilio account auth token>
```
3. Open the project base directory in terminal and run the following script:
```
npm run build
```
this script should be used if any changes are made to the code to ensure the correct compilation of Typescript code to Javascript code.

4. To finally start the applciation, enter the following script:
```
npm start
```
The applciation can also be started in debugging mode with the following script:
```
npm run dev
```

To use the APIs, following end points are available:

1. (**/api/v1/room/:name**) a POST request to this endpoint will respond by providing the API Key, Session ID, User Token and password for the session. This basically creates a tokbox session with the provided name and stores it in an array of current rooms.
2. (**/api/v1/room/:password) a GET request to this endpoint will respond by providing the API Key, Session ID, User Token and password for an existing session whose password matches with the provided password.

<h4>NOTE: You must add a "service" key in the Header section of API when using any of the above endpoints to specify which service you want to use for live session. As of now, only the "tokbox" and "twilio" srvices are present so a header of ("service":"tokbox" or "service":"twilio") would be needed for these endpoints to work</h4>

For more information, look up the following document:
https://docs.google.com/document/d/15PdMSYtCIOYdDvwIO1zhQp47Jmnh1MyQDmfjUaYOrV0/edit?usp=sharing
