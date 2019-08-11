'use strict';

import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const Wallet = mongoose.model('Wallet');
const ActiveWallet = mongoose.model('ActiveWallet');

exports.list = (req, res) => {
    Wallet.find({}, (err, tran) => {
        if (err) {
            res.send(err)
        }
        res.send(tran)
    })
}

exports.add_wallet = (req, res) => {
    const wallet = new Wallet(req.body)
    wallet.save();
    ActiveWallet.updateOne(
        { "_id" : ObjectId("5cdbd95e5dc74a10a8f52e9a") },
        { $set: { "walletId" : wallet._id.toString() } }
    )
        .then(res.send('Changed'), err => res.send(err))
}

exports.change_wallet = (req, res) => {
    ActiveWallet.updateOne(
        { "_id" : ObjectId("5cdbd95e5dc74a10a8f52e9a") },
        { $set: { "walletId" : req.query.id } }
    )
        .then(res.send('changed to curr'), err => res.send(err))
}

exports.get_active = async (req, res, next) => {
    const currWallet = await ActiveWallet.findOne({}, (err, model) => {
        if (err) {
            next(err);
        }
    })

    Wallet.findById(currWallet.walletId, (err, wallet) => {
        if (err) {
            next(err)
        }
        res.send(wallet)
    })
}
