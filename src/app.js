const express = require('express');
const app = express();
const { connectDB } = require("./config/database");

const cookiesParser = require('cookie-parser');

app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./routes/auth");
const profileRouter  = require("./routes/profile");

app.use("/",authRouter);
app.use("/",profileRouter);

connectDB().then(() => {
    console.log("Database connected established...");
    app.listen(3000, () => {
        console.log("Server is running")
    })
}).catch((err) => {
    console.error("Database cannot be connected!!", err);
});
