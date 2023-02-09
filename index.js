const bilbasen = require('./websites/bilbasen')
const dba = require('./websites/dba')

const application = require('./main')
const path = require('path')

const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(express.static(__dirname + "/public"))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'))

let shitVar = 0

app.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

app.get('/search', async (req, res) => {
    fs.readFile('results.json', 'utf8', (err, listings) => {
        if (err) { res.redirect('/'); return; }

        res.render('pages/results.ejs', { listings: JSON.parse(listings) })
    })
})


app.post('/getinfo', async (req, res) => {
    const searchTerm = req.body.searchTerm
    let searchUrl = bilbasen.buildUrl(searchTerm, [0, 400000])

    await application.ScrapeUrl(searchTerm, searchUrl)

    res.redirect('/search')
})

app.listen(8080, () => {
    console.log("Now listening on port 8080")
})