//main server file


import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB   from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import session from "express-session";



// using the  cooke parser  to store jwt in http only for the porpose of security  inssues
// that means if the jwt is stored in the local storage any one can access that  via in the browser by using document.cookie() object
import cookieParser from "cookie-parser";

dotenv.config();//configure env by dotenv and also  load the environment variables from .env fil
import passport from "./config/passport.js"; // import our setup// these shold be below  the dot env config  if it si 


connectDB();//connect to database

const app=express();// create an express applications
app.use(express.json());//to accept json data  and to pasrse the json body
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5174",  // no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// explicitly handle preflight
app.options("/", cors());






// sesssion midlware needed by  the passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// 🔥 Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/user",authRoutes);
app.use("/api/favorites",favoriteRoutes);


app.get("/",(req,res)=>{
    res.send("Ciniphere backend is running ")

})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);//template string
})//listen the server on port 5000
