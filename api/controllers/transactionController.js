'use strict';

import moment from 'moment';

const mongoose = require('mongoose'),
    Transaction = mongoose.model('Transaction'),
    Wallet = mongoose.model('Wallet'),
    ActiveWallet = mongoose.model('ActiveWallet');

exports.list = async (req, res, next) => {

    const currWallet = await ActiveWallet.findOne({}, (err, model) => {
        if (err) {
            next(err);
        }
    })

    Transaction.find({walletId: currWallet.walletId}, (err, tran) => {
        if (err) {
            next(err)
        }
        res.send(tran)
    });
}

exports.add_transaction = async (req, res, next) => {
    const data = new Transaction(req.body);
    const currWallet = await ActiveWallet.findOne({}, (err, model) => {
        if (err) {
            next(err);
        }
    })

    data.walletId = currWallet.walletId;

    const wallet = await Wallet.findById(currWallet.walletId, (err, wallet) => {
        if (err) {
            next(err)
        }
    })

    if (data.type === 'outgoing') {
        wallet.balance -= data.value;
    } else {
        wallet.balance += data.value;
    }

    if (moment(data.date).isAfter(moment(wallet.lastExpenses.date))) {
        wallet.lastExpenses = {
            date: data.date,
            value: data.value,
            currency: data.currency,
            category: data.category,
            type: data.type
        }
    }

    wallet.save().then(() => {
        data.save({}, (err, model) => {
            if (err) {
                next(err)
            }
            res.send(model)
        })
    })
}

exports.edit_transaction = (req, res) => {
    const data = new Transaction(req.body)
    data.findOne()
        .then(res.send('Saved'))
}

exports.delete = (req, res) => {
    const data = new Transaction(req.body)
    data.save()
        .then(res.send('Saved'))
}