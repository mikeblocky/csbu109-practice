const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const greetingsRouter = require('./routes/greetings');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/logger'); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); 

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const dataFile = path.join(dataDir, 'data.json');
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2), 'utf8');
}

app.use('/api/greetings', greetingsRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Hello World API!',
        version: '1.0.0',
        endpoints: {
            greetings: 'api/greetings',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }   
    });
});

app.use(notFoundHandler); 
app.use(errorHandler);    

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;