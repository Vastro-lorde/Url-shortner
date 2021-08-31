const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/url');
require('dotenv').config();
port = process.env.PORT;
db = process.env.DATABASE_URL

mongoose.connect(db,
    {
        useNewUrlParser : true,
        useUnifiedTopology: true,
    }).then(console.log('Connected to database'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : false}));


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render(`index`, { shortUrls : shortUrls })
});

app.post('/shortUrl',async (req, res) => {
    console.log(`This is the full url: ${req.body.url}`);
    await ShortUrl.create({ full: req.body.url})
    res.redirect('/')
});

app.get('/:shortUrl', async (req, res)=>{
    const shortUrl = await ShortUrl.findOne({ short : req.params.shortUrl });
    if(shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full)
})

app.listen(port || 5000, ()=>{
    console.log(`Listening at http://localhost:${process.env.PORT}`);
})