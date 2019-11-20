'use strict';

import mongoose from 'mongoose'
import { walletService } from '../services/wallet.service'
import { budgetService } from '../services/budgets.service'

const Budget = mongoose.model('Budget')

exports.list = async (req, res, next) => {
    const currWallet = await walletService.getActiveWallet();
    const budgets = await budgetService.getAllForWallet(currWallet.walletId);
    res.send(budgets);
};

exports.add_budget = async (req, res, next) => {
    const budget = new Budget(req.body);
    const currWallet = await walletService.getActiveWallet();
    budget.walletId = currWallet.walletId;

    await budget.save();

    res.send(budget);
};

exports.edit_budget = async (req, res, next) => {
    await Budget.findByIdAndDelete(req.query.id);
    res.send({ success: true, data: req.query.id })
};

exports.delete_budget = async (req, res, next) => {
    await Budget.findByIdAndDelete(req.query.id);
    res.send({ success: true, data: req.query.id })
};
