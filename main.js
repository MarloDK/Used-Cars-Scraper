const axios = require('axios')
const cheerio = require('cheerio')
const helperFunctions = require('./helperFunctions')
const fs = require('fs')

const bilbasen = require('./websites/bilbasen')
const dba = require('./websites/dba')

const userAgent = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'}

class Listing {
    Id = 0

    price = 0
    kilometers = 0
    productionYear = 0
    imageLink = ''

    link = ''

    constructor(link, imageLink, price, kilometers, productionYear, Id) {
        this.price = price
        this.kilometers = kilometers
        this.productionYear = productionYear
        this.imageLink = imageLink
        this.link = link

        this.Id = Id;
    }
}





//searchUrl = dba.buildUrl("corvette", [0, 500000], 100);



const ScrapeUrl = async function(url) {
    console.log(url)

    try {
        const { data } = await axios.get(url, { headers: userAgent } )
        const $ = cheerio.load(data)

        const listingUrls = $('.bb-listing-clickable .listing-heading').map((_, listingUrl) => {
            return 'https://bilbasen.dk' + $(listingUrl).attr('href')
        }).get()

        foundListings = new Array()
        foundListings = await Promise.all(listingUrls.map(async listingUrl => {
            const { data: listingData } = await axios.get(listingUrl, { headers: userAgent })
            const listingPage = cheerio.load(listingData)

            const imageLink = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-mainGallery > a > div > img').attr('src')
            const price = parseInt(listingPage('.bas-MuiCarPriceComponent-value').text().replace('kr.', '').replace('.', ''))
            const kilometers = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(3) > td').text().replace('km.', '').replace('.', ''))
            const productionYear = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td').text())
        
            return new Listing(listingUrl, imageLink, price, kilometers, productionYear, foundListings.length + 1)
        }))

        console.log(foundListings)
        foundListings = JSON.stringify(helperFunctions.sortListingsByPrice(foundListings, true), null, 2)

        return foundListings;
 
    } catch(error) {
        console.error(error)
    }
}

var searchUrl = bilbasen.buildUrl("Corvette", [0, 500000])
ScrapeUrl(searchUrl)

exports.ScrapeUrl = ScrapeUrl