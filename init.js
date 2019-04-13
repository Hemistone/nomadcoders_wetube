import "./db";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

import "./models/video";
import "./models/comment";
import "./models/User";

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log(`✅ Listening on: http://localhost${PORT}`);

app.listen(PORT, handleListening);