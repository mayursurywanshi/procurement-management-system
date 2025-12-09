const dotenv = require("dotenv");
dotenv.config();
const { connectDB } = require("./config/db")
const { app } = require("./app")

const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`)
})