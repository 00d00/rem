const discord = require('discord.js');



const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.json('Not found');
});


app.listen(3000);