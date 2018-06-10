const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handleBars = require('express-handlebars');
const stripe_keys = require('./config/keys');
const stripe = require('stripe')(stripe_keys.secret_key);

const port = process.env.PORT || 3000;

const app = express();

// views
app.engine('handlebars', handleBars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// index route
app.get('/', (req, res) => {
    res.render('index', { publishable_key:  stripe_keys.publishable_key});
});

// charge (stripe payment)
app.post('/charge', async (req, res) => {
    const fee = 1300;

    stripe.customers.create({email: req.body.stripeEmail, source: req.body.stripeToken})
        .then(customer => stripe.charges.create({amount: fee, description: 'Online Goods Store Product', currency: 'usd', customer: customer.id}))
        .then(charge => res.render('success'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));