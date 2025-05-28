require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require('./routes/auth.js');
const { profileRouter } = require('./routes/profile.js');
const {requestRouter} = require("./routes/request.js");
const{userRouter} = require("./routes/user.js")
const cors = require('cors');
const paymentRouter = require('./routes/payment.js');
const http = require("http");
const { initializeSocket } = require('./Utils/socket.js');
const { chatRouter } = require('./routes/chat.js');


const PORT = process.env.PORT || 3000;
 
//it will works for all the route.
//express.json() middleware convert JSON code into JS Object. 
//express.json() converts JSON data into a JavaScript object and assigns it to req.body.
app.use(express.json());

//cookie parser middleware help to read cookies from client side.
app.use(cookieParser());

//cors allow to server to make API calls or request from another domain.
app.use(cors({
    origin:"http://localhost:5173", //frontend url
    credentials:true // Allow cookies to be sent
    }
));

app.use("/",authRouter,profileRouter,requestRouter,userRouter,paymentRouter,chatRouter);


//configuration we need for socket.
const server = http.createServer(app);
initializeSocket(server);


// Connect DB and start server
connectDB()
.then(() => {
    console.log("Database connection established...");
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}..`);
    });
})
.catch((err) => {
    console.error("Database connection cannot be established...", err);
});