'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const WalletSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    period: {
        type: Number,
    },
    currency: {
        type: Number,
    },
    lastExpenses: {
        type: Object,
        default: {}
    },
    balance: {
        type: Number,
        default: 0
    }
},
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Wallet', WalletSchema);