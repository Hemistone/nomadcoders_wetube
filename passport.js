import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());

// Handle user authentication with mongoose and passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());