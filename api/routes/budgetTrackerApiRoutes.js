'use strict';

import Wallet from '../models/walletModel';
import ActiveWallet from '../models/activeWalletModel';
import Transaction from '../models/transactionModel';
import Category from '../models/categoryModel';

module.exports = function (app) {
  const transactions = require('../controllers/transactionController');
  const wallets = require('../controllers/walletController')
  const walletCategories = require('../controllers/walletCategoriesController')

  app.route('/transactions')
    .get(transactions.list)
    .post(transactions.add_transaction)
    .put(transactions.edit_transaction)
    .delete(transactions.delete);

  app.route('/wallets')
    .get(wallets.list)
    .post(wallets.add_wallet)
    .patch(wallets.change_wallet)

  app.route('/wallets/getActive')
    .get(wallets.get_active)

  app.route('/walletCategories')
    .get(walletCategories.list)
    .post(walletCategories.add_category)
};

