const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
// const laptopRoutes = require('./routes/laptopRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
// app.use('/api/laptops', laptopRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})