const paypal = require("paypal-rest-sdk")

paypal.configure({
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE
})

module.exports = paypal