const bilbasen = require('./websites/bilbasen');
const dba = require('./websites/dba');

const application = require('./main');
const path = require('path');

const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));

app.get('/', (req, res) => {
    res.render('pages/index.ejs');
});

app.get('/search', async (req, res) => {
    fs.readFile('results.json', 'utf8', (err, listings) => {
        if (err) { res.redirect('/'); return; }
        
        
        res.render('pages/results.ejs', { listings: JSON.parse(listings) });
    });
});


app.post('/getinfo', async (req, res) => {
    const searchTerm = req.body.searchTerm;

    startTime = Date.now();

    let finished = await application.ScrapeWebsites(searchTerm);

    loadTime = `Took ${Math.floor((Date.now() - startTime) / 1000)} Seconds to load.`;
    console.log(loadTime);

    res.redirect('/search');
});

app.listen(8080, () => {
    console.log("Now listening on port 8080");
});