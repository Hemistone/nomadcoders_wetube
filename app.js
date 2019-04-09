import express from "express";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";


const app = express();

//middleware
app.use(helmet()); //For Secure
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(cookieParser()); //check cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //checks json or form elements in body
app.use(morgan("dev")); //log all histories

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;