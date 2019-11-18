'use strict';

import moment from 'moment';
import mongoose from 'mongoose'

const Transaction = mongoose.model('Transaction'),
    Wallet = mongoose.model('Wallet'),
    ActiveWallet = mongoose.model('ActiveWallet');

exports.list = async (req, res, next) => {

    const currWallet = await ActiveWallet.findOne({}, (err, model) => {
        if (err) {
            next(err);
        }
    })

    Transaction.find({ walletId: currWallet.walletId }, (err, tran) => {
        if (err) {
            next(err)
        }
        res.send(tran)
    });
}

exports.add_transaction = async (req, res, next) => {
    let transaction = new Transaction(req.body);
    let currWallet = await ActiveWallet.findOne({}, (err, model) => {
        if (err) {
            next(err);
        }
    })

    transaction.walletId = currWallet.walletId;

    let wallet = await Wallet.findById(currWallet.walletId, (err, wallet) => {
        if (err) {
            next(err)
        }
    })

    if (transaction.type === 'outgoing') {
        wallet.balance -= transaction.value;
    } else {
        wallet.balance += transaction.value;
    }

    if (moment(transaction.date).isAfter(moment(wallet.lastExpenses.date))) {
        wallet.lastExpenses = {
            date: transaction.date,
            value: transaction.value,
            currency: transaction.currency,
            category: transaction.category,
            type: transaction.type
        }
    }

    let session = await mongoose.startSession();

    try {
        await session.startTransaction();

        await wallet.save();
        await transaction.save();

        await session.commitTransaction();

        res.send(transaction);
    } catch (err) {
        session.abortTransaction();

        next(err);
    }
}

exports.edit_transaction = async (req, res) => {
    let transaction = await Transaction.findById(req.body.id);
    await transaction.update(req.body);
    res.send(req.body);
}

exports.delete = async (req, res) => {
    await Transaction.findByIdAndDelete(req.query.id);
    res.send({ success: true, data: req.query.id })
}