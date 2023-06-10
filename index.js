const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser=require('body-parser');
dotenv.config();
const app = express();
const UserRoute = require('./routes/user');
const AuthRoute = require('./routes/auth');
app.use(cors());

// Increase the payload size limit to 50mb
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
mongoose.connect(process.env.MONGO_URL).then(function () {
    console.log('connected to mongodb');
}).catch(function (err) {
    console.log(err);
});
app.use(express.json());
// app.use('/',function(req,res){
//     res.send('hello world');
// })
app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.listen(process.env.PORT || 5000, function () {
    console.log('server is running on port 5000');
});