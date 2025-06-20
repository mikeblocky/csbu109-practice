
const requestLogger = (req, res, next) => {
    const now = new Date();
    const timestamp = now.toISOString(); 
    console.log(`${timestamp} | ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = requestLogger;