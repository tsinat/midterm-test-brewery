var express = require('express');
var request = require('request');
var router = express.Router();

var Beer = require('../models/beer');
var User = require('../models/user');


router.get('/beer', (req, res) => {
    var  options = {
        method: 'GET',
        url: 'http://api.brewerydb.com/v2/beer/random?key=d4faa7d83432d9d553144019512c48c2'
    };
    request(options, function(error, response, body) {
        if(error) throw new Error(error);
        var result = JSON.parse(body)

        Beer.create(result.data, (err, beer) => {
            if(err) throw new Error(err);

            res.send(beer)
        })
    })
})

router.get('/', (req, res) => {
    Beer.find({}, (err, beers) => {
        if (err) return res.status(400).send(err);

        else res.send(beers);
    });
});

router.get('/:id', User.isLoggedIn,  (req, res) => {
    Beer.getOne(req.params.id, (err, beer) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(beer);
        }
    });
});

router.post('/', User.isLoggedIn, (req, res) => {
    Beer.create(req.body, (err1, auction) => {
        if (err1) res.status(400).send(err1)
        else {
            User.addBeer(req.user, auction, (err2, addedBeer) => {
                if (err2) res.status(400).send(err2);
            });
        };
        res.send(auction);
    });
});

router.put('/:id', User.isLoggedIn, (req, res) => {
    Beer.update(req.params.id, req.body, (err, updatedBeer) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(updatedBeer);
        }
    });
});

router.delete('/:id', User.isLoggedIn, (req, res) => {
    Beer.deleteBeer(req.params.id, (err, deletedBeer) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(deletedBeer);
        }
    });
});

router.put('/:auctionId/addBid/:userId', User.isLoggedIn, (req, res) => {
    Beer.highBid(req.params.auctionId, req.params.userId, req.body, (err, hightestBid) => {
        if (err) res.status(400).send(err);

        res.send(hightestBid);
    });
});

module.exports = router;
