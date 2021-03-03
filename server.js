if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('./models/dbConfig');


mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());
app.use(cors());

// -- 

const routeUser = require('./routes/routeUser');
const routeProject = require('./routes/routeProject');

app.use('/user', routeUser);
app.use('/project', routeProject);

// -- 

app.listen(process.env.PORT || 8080, () => console.log('Server started; listening on 8080'));