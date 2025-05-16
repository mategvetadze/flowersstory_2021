import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
dotenv.config();

const app = express();
const Port = process.env.PORT || 4040

app.use(express.json());

app.listen(Port, () => {
    connectDB();
    console.log("server started at port " + Port);
})
