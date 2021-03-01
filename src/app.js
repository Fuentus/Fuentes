const express = require('express')
const bodyParser = require('body-parser');
const adminRouter = require('../routes/admin');

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(adminRouter)


//New User

app.get('/home/new-user', (req, res) => {
   
})

app.post('/home/new-user', (req, res) => {
        // "This will be a form with the following fields (options)
        // 1. Name
        // 2. Email
        // 3. Phone
        // 4. Measurements (dynamic form from admin)
        //      4.1 Item Name 
        //      4.2 Quantity 
        //      4.3 Unit
        // 5. File attachment
        // "
        // .then(() => console.log('Sucessfull'))
        // .catch(err => console.log(error))
})

app.post('/home/new-quote-request', (req, res) => {
    
})

//customer

app.get('/customer/login', (req, res) => {
    
})

app.post('/customer/login', (req, res) => {
    
})

app.get('/customer', (req, res) => {
    
})

app.get('/customer/quote-listing', (req, res) => {
    
})

app.delete('/customer/quote:id', (req, res) => {
    
})

app.update('/customer/quote:id', (req, res) => {
    
})

app.post('/customer/quote:id', (req, res) => {
    
})

app.get('/customer/profile', (req, res) => {
    
})

app.post('/customer/profile/password', (req, res) => {
    
})

app.post('/customer/profile/edit', (req, res) => {
    
})

app.post('/customer/logout', (req, res) => {
    
})

//admin




app.listen(PORT , () => {
    console.log('started')
})