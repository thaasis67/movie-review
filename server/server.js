const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const connectDb = require('./config/dbConnection')
const cors = require("cors");
require("dotenv").config();
const signupUser = require('./userHandler/signupUser');
const loginUser = require('./userHandler/loginUser');
const reviewRoutes = require('./routes/reviews');
const corsOptions = {
    origin: ["http://localhost:5173",
        "https://iridescent-chimera-59cbb7.netlify.app"
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
connectDb();
app.use(cors(corsOptions));
app.use(express.json());
app.get("/api", (req, res) => {
    res.json({backend:["server","responded"]});
});

app.use('/api', signupUser);
app.use('/api', loginUser);
app.use('/api/reviews', reviewRoutes);


app.listen(port, () => {
    console.log(`Server is running on port${port}`);
})