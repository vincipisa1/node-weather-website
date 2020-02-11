const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'https://api.darksky.net/forecast/9a4b42e7d5b488e904f663535844f76d/' + encodeURIComponent(lat) + ',' + encodeURIComponent(long)

    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            const currently = body.currently
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + currently.temperature + ' degrees out. There is a ' + currently.precipProbability + '% chance of rain')
        }
    })
}

module.exports = forecast