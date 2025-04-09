const express = require('express');
const winston = require('express-winston');
const logger = require('./services/logger');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const borrowRoutes = require('./routes/borrows');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(
  winston.logger({
    winstonInstance: logger,
    msg: 'HTTP {{req.method}} {{req.url}}',
  })
);

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/borrows', borrowRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishga tushdi`));