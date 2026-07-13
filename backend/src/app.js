const express = require("express") ;
const cors = require("cors");
const cookieParser = require("cookie-parser");

const healthCheck = require("./routes/index")   // set up routes to use versions
const registerUser = require("./routes/authRoutes")

const app = express() ;

app.use( cors () );
app.use( express.json() );
app.use( cookieParser() );

app.get ( "/" , (req , res) => {
    res.send( " Backend is running " ) ;
})

app.use("/api/v1" , healthCheck)   // any request starting with "/api/v1" should be handled by the router
app.use("/api/v1/auth" , registerUser)

module.exports = app ;