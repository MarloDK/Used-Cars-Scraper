
# Used Cars Scraper

A web app that scrapes Danish websites for used cars (https://dba.dk/ and https://bilbasen.dk)



***!!! IMPORTANT !!!

*This is a project for my programming exam and does not comply with the rules of any of the two websites. Do not use to find your next vehicle, but rather to learn how web scraping and web routing works in it's basic form. This is not a commercial product!*

## Installation
To install and use this application, you need to have NodeJS downloaded on your system. If you do not have NodeJS downloaded, you can do so with the link below.

https://nodejs.org/en/download/current

#### Installing the application
To get started, download the repository on your local machine. You can do so by clicking the download icon in the top right of this page, or by using Git.

#### Git
```bash
    git clone https://github.com/MarloDK/Used-Cars-Scraper
```


After downloading the project, install the required packages for NodeJS.
```bash
    npm install
```
When all the packages are installed, you can go ahead and run the web server with the following console command:
```bash
    nodemon index.js
```

#### Now you're all set!
# How to use
To use the application, head over to http://localhost:8080/ and type in the name of a car or a car manufacturer, then, press the arrow button to begin the search.

The application will then search with the same search term on both https://dba.dk/ and https://bilbasen.dk/, and find matching listings. Once all the listings have been found, the listings will be displayed in a single column on the website.

A listing is displayed with 5 types of information:
* The name of the car
* The fuel type of the vehicle
* The milage of the vehicle
* The manufacturing year of the vehicle
* The kilometers per litre

If any of the information could not be found by the application, it will be blank.
