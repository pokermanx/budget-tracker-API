'use strict';

import mongoose from 'mongoose'
import { walletService } from '../services/wallet.service'

const Transaction = mongoose.model('Transaction'),
    Wallet = mongoose.model('Wallet'),
    ActiveWallet = mongoose.model('ActiveWallet');

exports.list = async (req, res, next) => {

    const currWallet = await walletService.getActiveWallet();

    Transaction.find({ walletId: currWallet.walletId }, (err, tran) => {
        if (err) {
            next(err)
        }
        res.send(tran)
    });
}

exports.add_transaction = async (req, res, next) => {
    const transaction = new Transaction(req.body);

    const currWallet = await walletService.getActiveWallet();

    transaction.walletId = currWallet.walletId;

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        await walletService.changeLastActionIfEarliest(currWallet.walletId, transaction);
        await walletService.updateWalletBalance(currWallet.walletId, transaction);
        await transaction.save();

        await session.commitTransaction();

        res.send(transaction);
    } catch (err) {
        session.abortTransaction();

        next(err);
    }
}

exports.edit_transaction = async (req, res, next) => {
    const transaction = await Transaction.findById(req.body._id);

    const currWallet = await walletService.getActiveWallet();
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        await walletService.changeLastActionIfEarliest(currWallet.walletId, req.body);
        await walletService.updateWalletBalanceEdit(currWallet.walletId, transaction, req.body);
        await transaction.update(req.body);

        await session.commitTransaction();

        res.send(req.body);
    } catch (err) {
        session.abortTransaction();

        next(err);
    }
}

exports.delete = async (req, res, next) => {
    const transaction = await Transaction.findById(req.query.id);

    const currWallet = await walletService.getActiveWallet();
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        await walletService.changeLastActionIfEarliest(currWallet.walletId, req.body);
        await walletService.updateWalletBalanceDelete(currWallet.walletId, transaction);
        await Transaction.findByIdAndDelete(req.query.id);

        await session.commitTransaction();

        res.send({ success: true, data: req.query.id })
    } catch (err) {
        session.abortTransaction();

        next(err);
    }
}