const mongoose = require('mongoose');

mongoose.connect(
    process.env.DATABASE_URL || 'mongodb://mongo/skillman-api',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (!err) {
            console.log("MongoDB connected");
        } else
            console.log("MongoDB connection error:" + err);
    }
)