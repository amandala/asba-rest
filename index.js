var express = require("express");
var app = express();
bodyParser = require('body-parser');
var mongoose = require('mongoose');

// database schemas
var Brewery = require('./models/brewery.js');

// enable retrieving data from POST with body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// *** DATABASE ***
// connect to remote mongoos instance
var db = process.env.MONGODB_URL || 'mongodb://asba-admin:#IloveBeer@ds149557.mlab.com:49557/asba';
mongoose.connect(db);


// *** Routes for API ***
var router = express.Router();

// middlware
router.use(function(req, res, next){
    console.log("Someone's thirsy for ", req.url);
    next();
});

router.get('/', function(req, res) {
    res.json({
        message: "Cheers! You made it!",
        endpoints: {
            breweries: '/api/breweries',
            brewery: '/api/breweries/brewery_id'
        }
    });
});

// route /breweries GET and POST
router.route('/breweries')
    .post(function(req, res) {
        var brewery = new Brewery();
        brewery.name = req.body.name;
        brewery,email = req.body.email;
        brewery.image = req.body.image;
        brewery.website = req.body.website;
        brewery.description = req.body.description;
        brewery.address = req.body.address;
        brewery.city = req.body.city;
        brewery.phone = req.body.phone;
        brewery.latd = req.body.latd;
        brewery.longd = req.body.longd;
        brewery.placeId = brewery.placeId.push(req.body.placeId);
        brewery.instgram = req.body.instagram;
        brewery.twitter = req.body.twitter;
        brewery.facebook = req.body.facebook;

        brewery.save(err => {
            if (err)
                res.send(err);

            res.json({
                message: "Brewery created",
                data: brewery
            });
        });
    })
    .get(function (req, res) {
        Brewery.find(function(err, breweries) {
            if(err)
                res.send(err);
            res.json(breweries);
        });
    });

router.route('/breweries/:brewery_id')
    .get(function(req, res) {
        Brewery.findById(req.params.brewery_id, function(err, brewery) {
            if(err)
                res.send(err);
            res.json(brewery);
        });
    })

    .put(function(req, res){
        Brewery.findById(req.params.brewery_id, function(err, brewery){
            if(err)
                res.send(err);

            if(req.body.name)
                brewery.name = req.body.name;
            if(req.body.email)
                brewery.email = req.body.email;
            if(req.body.website)
                brewery.website = req.body.website;
            if(req.body.image)
                brewery.image = req.body.image;
            if(req.body.description)
                brewery.description = req.body.description;
            if(req.body.adddress)
                brewery.adddress = req.body.adddress;
            if(req.body.city)
                brewery.city = req.body.city;
            if(req.body.phone)
                brewery.phone = req.body.phone;
            if(req.body.latd)
                brewery.latd = req.body.latd;
            if(req.body.longd)
                brewery.longd = req.body.longd;
            if(req.body.placeId)
                brewery.placeId.push(req.body.placeId);
            if(req.body.instagram)
                brewery.instagram = req.body.instagram;
            if(req.body.twitter)
                brewery.twitter = req.body.twitter;
            if(req.body.facebook)
                brewery.facebook = req.body.facebook;

            brewery.save(function(err){
                if(err)
                    res.send(err);
                res.json({
                    message : "Brewery updated",
                    data: brewery
                });
            })

        });
    })

    .delete(function(req,res){
        Brewery.remove({
            _id: req.params.brewery_id
        }, function(err, brewery){
            if(err)
                res.send(err)
            res.json({ message : "Brewery deleted :( "});
        });
    });


// Register the routes and define prefix of /api
app.use('/api', router);

var port = process.env.PORT || 4200;
app.listen(port);
console.log("Happy Hour happens on port " + port);
