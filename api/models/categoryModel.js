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

CategorySchema.method('toJSON', function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model('Category', CategorySchema);