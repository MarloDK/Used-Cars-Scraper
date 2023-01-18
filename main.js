const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const bilbasen = require('./websites/bilbasen.js')
const dba = require('./websites/dba.js')

const userAgent = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'}

class Listing {
    title = ''
    kilometers = 0
    productionYear = 0
    

    link = ''

    constructor(title, kilometers, productionYear, link) {
        this.title = title
        this.kilometers = kilometers
        this.productionYear = productionYear
        this.link = link

        console.log(`Created new listing object for listing: ${link}`)
    }
}



var searchUrl = bilbasen.buildUrl("corvette", [0, 500000])
ScrapeUrl(searchUrl)

//searchUrl = dba.buildUrl("corvette", [0, 500000], 100);

// Funktion til at scrape et website
function ScrapeUrl(url) {

    // Benytter Axios til at oprette en GET request til URLet i variablet "url".
    // Samtidig bliver der brugt headeren "User-Agent" til at bestemme hvilken browser
    // hjemmesiden tror vi benytter (Fra variablet userAgent).
    axios.get(url, {headers: userAgent})
    // Når GET requesten er modtaget, forsæt her med variblet "data" fra requesten.
    .then(({ data }) => {
        // Load dataen med cheerio så vi kan benytte CSS selectors i vores kode
        const $ = cheerio.load(data)

        var listingUrls = []

        $('.bb-listing-clickable .listing-heading').each(function() {
            var link = $(this).attr('href')
            listingUrls.push('https://bilbasen.dk' + link)
        })



        // https://www.bilbasen.dk/brugt/bil/chevrolet/corvette/60-cabriolet-2d/3311765


        listingUrls.forEach(listingUrl => {
            axios.get(listingUrl, {headers: userAgent})
                .then(({data}) => {
                    const listingPage = cheerio.load(data)

                    //var productImage = listingPage('.bas-MuiGalleryImageComponent-image').text()
                    // Gør som før med href, linje 50

                    var price = listingPage('.bas-MuiCarPriceComponent-value').text()
                    var productionYear = listingPage('.bas-MuiCarPriceComponent-value').text()
                    var kilometers = listingPage('.bas-MuiCarPriceComponent-value').text()

                    console.log(`Price: ${price} \nLink: ${listingUrl}`)
                })
        });

        //console.log(listingUrls)
    })
    .catch((error) => {
        console.log(error)
    })
}
builtUrl = ""

