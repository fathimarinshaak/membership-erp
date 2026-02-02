require('dotenv').config()

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.listen(port, async () => {
    console.log(` App started on port ${port}`);
});