const bilbasen = require('./websites/bilbasen')
const dba = require('./websites/dba')

const application = require('./main')
const path = require('path')

const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'))

app.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

app.get('/search', async (req, res) => {
    const searchTerm = req.query.searchTerm
    let searchUrl = bilbasen.buildUrl(searchTerm)

    // Returns as undefined when sent as listings variable in render function
    let allListings = await application.ScrapeUrl(searchUrl)
    console.log(allListings)

    // If I send this as the listings in the render function, it works
    let listings = [{link: 'https://buttfucknowhere.com/', price: 200000}, {link: 'https://buttfucknowhere.com/', price: 230000}]


    res.render('pages/results.ejs', { listings: allListings }) // JSON.stringify(allListings)
})


app.listen(8080, () => {
    console.log("Now listening on port 8080")
})