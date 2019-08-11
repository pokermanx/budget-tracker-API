'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActiveWalletSchema = new Schema({
    walletId: Schema.Types.ObjectId
},
    {
        versionKey: false
    }
)

module.exports = mongoose.model('ActiveWallet', ActiveWalletSchema);
