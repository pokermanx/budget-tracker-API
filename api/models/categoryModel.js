'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    walletId: {
        type: Schema.Types.ObjectId
    },
    type: {
        type: String,
        enum: ['income', 'outgoing'],
    },
    name: {
        type: String
    },
    color: {
        type: String
    }
},
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Category', CategorySchema);