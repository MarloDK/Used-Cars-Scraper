// Gemmer reference til main.js som variablet application
const application = require('./main');

// Importerer path biblioteket
const path = require('path');

// Importerer express biblioteket
const express = require('express');

// Importerer filesystem (fs) biblioteket
const fs = require('fs');

// Opretter express instance som variablet app
const app = express();

// Sætter flags til express
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(express.static(__dirname + "/public"));

// Vælger ejs som vores view engine, i stedet for normalt html
app.set('view engine', 'ejs');
// Vælger mappen /public/views som mappen hvor vi gemmer vores sider
app.set('views', path.join(__dirname, '/public/views'));

// GET http://localhost:8080/
app.get('/', (req, res) => {
    // Vis siden index.ejs
    res.render('pages/index.ejs');
});

// GET http://localhost:8080/search
app.get('/results', async (req, res) => {

    // Læs filen results.json
    fs.readFile('results.json', 'utf8', (err, listings) => {
        // Hvis det ikke kan lade sig gøre, henvis til http://localhost:8080/
        if (err) { res.redirect('/'); return; }
        
        // Vis siden results.ejs, og oversæt listings til JSON og send det som data 
        // (Sender mængden af opslag som seperat variabel)
        res.render('pages/results.ejs', { listingsCount: listings.length, listings: JSON.parse(listings) });
    });
});

// POST http://localhost:8080/getinfo
app.post('/getinfo', async (req, res) => {
    // searchTerm = /getinfo?searchTerm=[searchTerm]
    const searchTerm = req.body.searchTerm;

    // Kald funktionen ScrapeWebsites i application med searchTerm, og vent på den er færdig
    await application.ScrapeWebsites(searchTerm);
    // Henvis til siden http://localhost:8080/search
    res.redirect('/results');
});

// Start serveren på port 8080
app.listen(8080, () => {
    console.log("Now listening on port 8080");
});