const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const app = express();

//Templating Engine
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public')))
app.set('views', path.join(__dirname, '../viewsPage/views'))
hbs.registerPartials(path.join(__dirname, '../viewsPage/partials'))

app.get('', (req, res, next) => {
    res.render('index', {
        title: 'Weather',
        name: 'Larry'
    })
})

app.get('/help', (req, res, next) => {
    res.render('help', {
        name: 'Larry',
        title: 'Help'
    })
})

app.get('/about', (req, res, next) => {
    res.render('about', {
        title: 'About Me',
        name: 'Larry'
    })
})

app.get('/weather', (req, res, next) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please type a city'
        })
    }
    geocode(req.query.address, (error, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address

            })
        })
    })

})

app.get('/products', (req, res, next) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res, next) => {
    res.render('error', {
        title: '404',
        name: 'Larry',
        msg: 'Help article not found'
    })
})

app.get('*', (req, res, next) => {
    res.render('error', {
        title: '404',
        name: 'Larry',
        msg: 'Page not found'
    })
})
// app.com
// app.com/help
// app.com/about





app.listen(3000, () => {
    console.log('Server started on port 3000')
})