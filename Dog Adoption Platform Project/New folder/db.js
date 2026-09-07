const mongoose = require('mongoose');
module.exports = function connectDatabase(uri = process.env.MONGODB_URI) { if (!uri || uri === 'your_mongodb_uri_here') throw new Error('MONGODB_URI must be configured.'); return mongoose.connect(uri, { dbName: process.env.DB_NAME || undefined }); };
