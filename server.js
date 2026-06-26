require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server http://localhost:${PORT} portunda işə düşdü!`);
    });
});