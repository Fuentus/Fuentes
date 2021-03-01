const express = require('express')
const measureRouter = require('../router/measure')
const quoteRoute = require('../router/quote')

const app = express()
app.use(quoteRoute)
app.use(measureRouter)


const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => {
    console.log('running')
})