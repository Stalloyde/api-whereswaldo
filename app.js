require('./db.js');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const indexRouter = require('./routes/index');

const app = express();

const corsOptions = {
  origin: 'https://wheres-waldo-six.vercel.app',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', upload.none(), indexRouter);

module.exports = app;
