import express from 'express';
import cors from "cors";
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js"

dotenv.config();

const app = express();

app.use(cors({
	origin: process.env.FRONT_PART_URL,
	credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/", userRouter)

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT

const start = async () => {
	try {
		mongoose.connect(DB_URL);
		app.listen(PORT, () => console.log(`Server launched on PORT: ${PORT}`))
	} catch (error) {
		console.log(error)
	}
}

start(); 