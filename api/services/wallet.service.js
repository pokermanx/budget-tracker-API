import mongoose from 'mongoose';
import moment from 'moment';

class WalletService {

    constructor() {
        this._walletRepository = mongoose.model('Wallet');
        this._activeWalletRepository = mongoose.model('ActiveWallet');
    }

    async findAll() {
        return await this._walletRepository.find({});
    }

    async changeLastActionIfEarliest(walletId, newTransaction) {
        const wallet = await this._walletRepository.findById(walletId);
        if (moment(newTransaction.date).isAfter(moment(wallet.lastExpenses.date)) || moment(newTransaction.date).isSame(moment(wallet.lastExpenses.date))) {
            wallet.lastExpenses = {
                date: newTransaction.date,
                value: newTransaction.value,
                currency: newTransaction.currency,
                category: newTransaction.category,
                type: newTransaction.type
            };
            return wallet.save();
        }
    }

    async getActiveWallet() {
        return this._activeWalletRepository.findOne({});
    }

    async updateWalletBalance(walletId, transaction) {
        const wallet = await this._walletRepository.findById(walletId);
        if (transaction.type === 'outgoing') {
            wallet.balance -= +transaction.value;
        } else {
            wallet.balance += +transaction.value;
        }
        return wallet.save();
    }

    async updateWalletBalanceEdit(walletId, oldTran, newTran) {
        const wallet = await this._walletRepository.findById(walletId);
        if (oldTran.type === 'outgoing') {
            wallet.balance += +oldTran.value;
        } else {
            wallet.balance -= +oldTran.value;
        }
        if (newTran.type === 'outgoing') {
            wallet.balance -= +newTran.value;
        } else {
            wallet.balance += +newTran.value;
        }
        return wallet.save();
    }

    async updateWalletBalanceDelete(walletId, transaction) {
        const wallet = await this._walletRepository.findById(walletId);
        if (transaction.type === 'outgoing') {
            wallet.balance += +transaction.value;
        } else {
            wallet.balance -= +transaction.value;
        }
        return wallet.save();
    }
}

export const walletService = new WalletService();