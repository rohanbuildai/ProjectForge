const express = require("express") ;
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes")   // set up routes to use versions

const app = express() ;

app.use( cors () );
app.use( express.json() );
app.use( cookieParser() );

app.get ( "/" , (req , res) => {
    res.send( " Backend is running " ) ;
})

app.use("/api/v1" , routes)   // any request starting with "/api/v1" should be handled by the router

module.exports = app ;