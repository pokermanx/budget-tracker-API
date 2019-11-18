import mongoose from 'mongoose';

class WalletService {

    constructor() {
        console.error('asddasdas');
        this._walletRepository = mongoose.model('Wallet');
    }

    async findAll() {
        //await this._walletRepository.insertMany([{}]);
        return await this._walletRepository.find({});
    }
}

export const walletService = new WalletService();