let express = require('express');
let { createServer } = require('http');
let dotenv = require('dotenv');
let bodyParser = require('body-parser');
dotenv.config()

//db connection
require('./src/db/connection');

const app = express();
const server = createServer(app);

app.use(bodyParser.json({limit:'500mb'}))

//routes
const projectRoutes = require("./src/routes/projectRoutes")
const categoryRoutes = require("./src/routes/categoryRoutes")

app.use("/project",projectRoutes);
app.use("/category",categoryRoutes);

server.listen(process.env.PORT,() => {
    console.log(`Server ready at http://localhost:` + process.env.PORT)
});