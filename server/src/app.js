const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require('./routes/auth.js');
const { profileRouter } = require('./routes/profile.js');
const {requestRouter} = require("./routes/request.js");
const{userRouter} = require("./routes/user.js")
const cors = require('cors');

 
//it will works for all the route.
//express.json() middleware convert JSON code into JS Object. 
app.use(express.json());

//cookie parser middleware help to read cookies from client side.
app.use(cookieParser());

//cors allow to server to make API calls or request from another domain.
app.use(cors({
    origin:"http://localhost:5173", //frontend url
    credentials:true // Allow cookies to be sent
    }
));

app.use("/",authRouter,profileRouter,requestRouter,userRouter);

//connected to mongoDB.
connectDB()
.then(()=>{
    console.log("Database connection established...");  

    //listening port on 3000
    app.listen(3000,()=>{
        console.log("Server is listening on port 3000..");
    });
})
.catch((err)=>{
    console.error("Database connection cannot be established...",err);
});