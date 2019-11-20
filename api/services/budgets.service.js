import mongoose from 'mongoose';

class BudgetService {

    constructor() {
        this._budgetRepository = mongoose.model('Budget');
    }

    async getAllForWallet(walletId) {
        return await this._budgetRepository.find({ walletId });
    }

    async updateValueByCategory(walletId, category, value) {
        const budgets = await this.getAllForWallet(walletId);

        return budgets.forEach(async el => {
            if (el.categories.includes(category)) {
                el.valueUsed += value;
            }
            await el.save();
            return el;
        });
    }

    async updateValueByCategoryEdit(walletId, oldTran, newTran) {
        const budgets = await this.getAllForWallet(walletId);

        return budgets.forEach(async el => {
            if (el.categories.includes(category)) {
                el.valueUsed += +newTran.value - +oldTran.value;
            }
            await el.save();
            return el;
        });
    }
}

export const budgetService = new BudgetService();
