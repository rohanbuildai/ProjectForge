const express = require("express") ;
const cors = require("cors");
const cookieParser = require("cookie-parser");

const indexRoutes = require("./routes/index")   // set up routes to use versions

const app = express() ;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use( express.json() );
app.use( cookieParser() );

app.get ( "/" , (req , res) => {
    res.send( " Backend is running " ) ;
})

app.use("/api/v1" , indexRoutes)   // any request starting with "/api/v1" should be handled by the router

module.exports = app ;