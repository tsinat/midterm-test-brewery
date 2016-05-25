'use strict';

var mongoose = require('mongoose');

var beerSchema = new mongoose.Schema({
    id: {type: String},
    name: {type: String},
    nameDisplay:{type: String },
    description: {type: Object},
    rate: [{
        value: { type: Number},
        rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }]
});

beerSchema.statics.getOne = (id, cb) => {
    Beer.findById(id, (err, beer) => {
        if(err) return cb(err);
        cb(null, beer);
    });
};

beerSchema.statics.create = (newBeer, cb) => {
    console.log('beer create:', newBeer.id);
    var beer = new Beer({
        id: newBeer.id,
        name: newBeer.name,
        nameDisplay: newBeer.nameDisplay,
        description: newBeer.description
    });
    beer.save((err, savedBeer) => {
        if(err) return cb(err);

        else cb(null, savedBeer);
    });
};

beerSchema.statics.update = (id, currentBeer, cb) => {
    var obj = currentBeer;
    Beer.findByIdAndUpdate(id, { $set: obj}, (err, updatedBeer) => {
        if(err) cb(err);

        updatedBeer.save((err, savedBeer) => {
            if(err) cb(err);

            cb(null, savedBeer);
        });
    });
};

beerSchema.statics.deleteBeer = (id, cb) => {
    Beer.findByIdAndRemove(id, (err, deletedBeer) => {
        if(err){
            cb(err)
        }
        else {
            cb(deletedBeer);
        }
    });
};

beerSchema.statics.highBid = (beerId, userId, bid, cb) => {
    Beer.findById(beerId, (err, beer) => {
        console.log("beer:", beer);
        if(err) cb(err);

        var obj = {
            value: Number(bid.value),
            bider: bid.bider
        };
        console.log('bid:', obj);
        console.log('hightestBid:', typeof beer.highestBid);

        beer.highestBid.push(obj);

        beer.save((err, savedBid) => {
            if(err) cb(err);

            cb(null , savedBid)
        })
    })
}

var Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;
