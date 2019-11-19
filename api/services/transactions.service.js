import mongoose from 'mongoose';

class TransactionsService {

    constructor() {
        this._transactionsRepository = mongoose.model('Transaction');
    }

    async getLatestTransaction(walletId) {
        return await this._transactionsRepository.findOne({}, {}, { sort: { 'walletId': walletId, 'date': -1 } }, function (err, post) {
            console.log(post);
        });
    }

    async getAllForWallet(walletId) {
        return await this._transactionsRepository.find({ walletId });
    }
}

export const transactionsService = new TransactionsService();
