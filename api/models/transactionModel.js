'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    walletId: {
        type: Schema.Types.ObjectId
    },
    date: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['income', 'outgoing']
    },
    value: {
        type: Number,
    },
    description: {
        type: String,
        default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        required: false
    },
    currency: {
        type: Number
    },
},
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Transaction', TransactionSchema);