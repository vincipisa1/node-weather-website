const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()

// Define paths for express config
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve (pagine statiche)
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Vincenzo P.'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Vincenzo P.'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text',
        name: 'Vincenzo P.'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: 'You must provide a address'
        })
    }

    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                location: location, // abbreviata posso scrivere solo location senza assegnare nulla perché hanno lo stesso nome, vedi error sopra
                forecast: forecast
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Page Error',
        name: 'Vincenzo P.',
        errorMessage: 'Help Article not Found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page Error',
        name: 'Vincenzo P.',
        errorMessage: 'Page not found'
    })
})

// Il server rimane in attesa sulla porta 3000
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})

// APPUNTI
// Render permette di rindirizzare la pagina, in questo caso alla 404
// * prende tutte le pagine non elecante nei get prima, sarebbero le 404
// req.query permette di prendere i parametri i query string