require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const routes =  require("./routes/userRoutes");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = process.env.PORT || 7000;

routes(app)

app.listen(port, () => {
    console.log("server runing on " + port);
})
module.exports = app;