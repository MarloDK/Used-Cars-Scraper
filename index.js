const bilbasen = require('./websites/bilbasen')
const dba = require('./websites/dba')

const application = require('./main')
const path = require('path')

const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'))

app.get('/', (req, res) => {

    fs.readFile('results.txt', 'utf8', (err, listings) => {
        if (err) { res.render('pages/index.ejs'); return; }

        res.render('pages/results.ejs', { listings: listings })
    })
})

app.get('/search', async (req, res) => {
    const searchTerm = req.query.searchTerm
    let searchUrl = bilbasen.buildUrl(searchTerm, [0, 400000])

    // Returns as undefined when sent as listings variable in render function
    //let listings = await JSON.stringify(application.ScrapeUrl(searchUrl))
    let listings = await application.ScrapeUrl(searchUrl)
    console.log(listings)

    // If I send this as the listings in the render function, it works
    //let listings = [{link: 'https://buttfucknowhere.com/', price: 200000}, {link: 'https://buttfucknowhere.com/', price: 230000}]


    res.render('pages/results.ejs', { listings: await JSON.stringify(application.ScrapeUrl(searchUrl)) }) // JSON.stringify(allListings)
})


app.listen(8080, () => {
    console.log("Now listening on port 8080")
})