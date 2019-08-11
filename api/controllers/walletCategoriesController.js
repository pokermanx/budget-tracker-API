'use strict';

import mongoose from 'mongoose';

const ActiveWallet = mongoose.model('ActiveWallet');
const Category = mongoose.model('Category');

exports.list = async (req, res, next) => {
    const currId = await getCurrentWallet();
    Category.find({ walletId: currId }, (err, cats) => {
        if (err) {
            next(err)
        }
        res.send(cats)
    })
}

exports.add_category = async (req, res, next) => {
    req.body.walletId = await getCurrentWallet(next);
    const category = new Category(req.body)
    category.save({}, (err, model) => {
        if (err) {
            next(err)
        }
        res.send(model)
    });
}

function getCurrentWallet(next) {
    return new Promise((resolve, reject) => {
        ActiveWallet.findOne({}, (err, model) => {
            if (err) {
                next(err);
                reject(err)
            }
            resolve(model.walletId);
        })
    })
}