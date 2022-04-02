import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { errorHander, routeNotFoundHander } from "./middleware";
import { loginRouter, testRouter } from "./routes";
import { connectDB } from "./config";
const cookieParser = require("cookie-parser");

//Create the epress app
const app = express();
app.use(cookieParser());

//Configure the dotenv package so that we can use env variables accross the app
dotenv.config();

//connect mongo DB
connectDB();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieSession({ keys: ["laskdjf"] }));
app.use(loginRouter, testRouter);

//register middlewares to handle server side errors.
app.use(errorHander);

//register middlewares to handle routes that are not present
app.use(routeNotFoundHander);

//Get the port number from env variable. If its not present use default port number (3001)
const port = process.env.PORT || 3001;

//Start the server
app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
