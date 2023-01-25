const bilbasen = require('./websites/bilbasen')
const dba = require('./websites/dba')

const application = require('./main')
const path = require('path')

const express = require('express')
const { mainModule } = require('process')
const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'))

app.get('/', (req, res) => {
    let searchUrl = bilbasen.buildUrl("Toyota Aygo", [0, 500000])

    listings = application.ScrapeUrl(searchUrl)



    res.render('pages/index.ejs', {listings})
})

app.listen(8080, () => {
    console.log("Now listening on port 8080")
})