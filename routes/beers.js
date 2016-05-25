var express = require('express');
var request = require('request');
var router = express.Router();

var Beer = require('../models/beer');
var User = require('../models/user');


router.get('/', (req, res) => {
    var  options = {
        method: 'GET',
        url: 'http://api.brewerydb.com/v2/beer/random?key=d4faa7d83432d9d553144019512c48c2'
    };
    request(options, function(err, res, body) {
        if(err) throw new Error(err);
        console.log(body.id)
        Beer.create(body.data, (err, beer) => {
            if(err) throw new Error(err);

            res.send(beer)
        })
    })
})

// router.get('/', (req, res) => {
//     Beer.find({}, (err, auctions) => {
//         if (err) return res.status(400).send(err);
//
//         else res.send(auctions);
//     });
// });

router.get('/:id', (req, res) => {
    Beer.getOne(req.params.id, (err, auction) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(auction);
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
