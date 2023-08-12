require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions=require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT=require('./middleware/verifyJWT');

const cookieParser=require('cookie-parser');
const credentials=require('./middleware/credentials');
const mongoose=require('mongoose');
const connectDB=require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connec DB
connectDB();

//custom middlewarelogger
app.use(logger);

//Handle options creedentials check -before CORS
//and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing

app.use(cors(corsOptions));


//built-in middleware to handle orlencoded data
//in other words, form data:
//'content-type: application/x-www-form-urlencoded' 
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//built-in middleware serve static files
app.use('/',express.static(path.join(__dirname, '/public')));

//Add routes
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees'));
app.use('/users',require('./routes/api/users'));
//Default always at the end

app.all('*', (req, res) => {
    res.status(404);    
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else    if (req.accepts('json')) {
        res.json({error:"404 Not Found"})
    }else{
        res.type('txt').send("404 Not Found");
    }
});
app.use(errorHandler);

//Listenign for request only if connection with mongo is successfully
mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`server runing on port ${PORT}`));
});
