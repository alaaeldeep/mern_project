/* express */
import express from "express";
const app = express();

/* database */
import mongoose from "mongoose";
import connectDB from "./config/dbConnect.js";

/* path */
import path from "path";

/* cookie parser */
import cookieParser from "cookie-parser";

/* cors */
import cors from "cors";

/* environment */
import "dotenv/config";

/* routes */
import userRoute from "./routes/userRoutes.js";
/*  */
const __dirname = path.dirname(import.meta.url);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "/public")));

connectDB();

app.use(userRoute);
app.all("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
});

/* DB */
mongoose.connection.once("open", () => {
    console.log("connect to Mongoose 👍");
    app.listen(port, () => {
        console.log(`server running on port ${port} 👍`);
    });
});
mongoose.connection.on("error", (error) => {
    console.log(`${error}⛔⛔`);
});
