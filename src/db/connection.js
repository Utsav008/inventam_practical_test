let mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("MongoDB connected successfully!")
}).catch((err) => {
    console.error("MongoDB connection error:", err)
})