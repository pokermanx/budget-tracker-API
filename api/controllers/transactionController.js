'use strict';

import mongoose from 'mongoose'
import { walletService } from '../services/wallet.service'
import { budgetService } from '../services/budgets.service'
import { transactionsService } from '../services/transactions.service'

const Transaction = mongoose.model('Transaction')

exports.list = async (req, res, next) => {
    const currWallet = await walletService.getActiveWallet();
    const transactions = await transactionsService.getAllForWallet(currWallet.walletId);
    res.send(transactions);
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
        await budgetService.updateValueByCategory(currWallet.walletId, transaction.category, transaction.value);
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

        await walletService.updateWalletBalanceDelete(currWallet.walletId, transaction);
        await Transaction.findByIdAndDelete(req.query.id);

        const lastTransaction = await transactionsService.getLatestTransaction();
        await walletService.forceSetLastAction(currWallet.walletId, lastTransaction);

        await session.commitTransaction();

        res.send({ success: true, data: req.query.id })
    } catch (err) {
        session.abortTransaction();

        next(err);
    }
}