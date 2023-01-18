const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const bilbasen = require('./websites/bilbasen.js')
const dba = require('./websites/dba.js')

const userAgent = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'}

var foundListings = []
class Listing {
    Id = 0

    price = 0
    kilometers = 0
    productionYear = 0
    imageLink = ''

    link = ''

    constructor(link, imageLink, price, kilometers, productionYear) {
        this.price = price
        this.kilometers = kilometers
        this.productionYear = productionYear
        this.imageLink = imageLink
        this.link = link

        this.Id = foundListings.length + 1;

        //console.log(`Created new listing object for listing: ${link}`)
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

                    var imageLink = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-mainGallery > a > div > img').attr('src')
                    var price = listingPage('.bas-MuiCarPriceComponent-value').text()
                    var productionYear = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td').text()
                    var kilometers = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(3) > td').text()

                    let newListing = new Listing(listingUrl, imageLink, price, kilometers, productionYear)
                    foundListings.push(newListing)

                    console.log(newListing)
                })
        })
    })
    .catch((error) => {
        console.log(error)
    })
}
builtUrl = ""

