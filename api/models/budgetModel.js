'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
    walletId: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 0,
        required: true
    },
    valueUsed: {
        type: Number,
        default: 0,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    period: {
        type: Number | String,
        enum: [
            "Day",
            "Week",
            "Month",
            "HalfAYear",
            "Year",
            "Forever"
        ]
    },
},
    {
        versionKey: false
    }
);

BudgetSchema.method('toJSON', function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model('Budget', BudgetSchema);