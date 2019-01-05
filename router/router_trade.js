const express  = require('express'),router= express.Router();
const tradeController = require('../controllers/trade')
const usercontroller = require('../controllers/user')
const multer = require('multer');
var upload = multer();
const middleware = require("../middleware/middleware")
//en

router.get('/wallet-currency',middleware.checkRole(["trader"]) ,usercontroller.wallet)

router.post('/api/trade/otc/order',middleware.checkRole(["trader"]) ,tradeController.sendRequestOrder);
router.post('/api/trade/otc/cancel-order',middleware.checkRole(["trader"]) ,tradeController.sendRequestCancelOrder);
router.post('/api/trade/otc/orders', middleware.checkRole(["trader",'guest']), tradeController.sendRequestViewAllOrders);
router.post('/api/trade/otc/all-orders', middleware.checkRole(["trader"]), tradeController.getAllOrders);
router.post('/api/trade/otc/avaiable-balance', middleware.checkRole(["trader"]), tradeController.avaiable_balance);

router.post('/api/trade/real-time-market/order',middleware.checkRole(["trader"]) ,tradeController.sendRequestOrder);
router.post('/api/trade/real-time-market/cancel-order',middleware.checkRole(["trader"]) ,tradeController.sendRequestCancelOrder);
router.post('/api/trade/real-time-market/orders', middleware.checkRole(["trader",'guest']), tradeController.sendRequestViewAllOrders);
router.post('/api/trade/real-time-market/all-orders', middleware.checkRole(["trader"]), tradeController.getAllOrders);
router.post('/api/trade/real-time-market/avaiable-balance', middleware.checkRole(["trader"]), tradeController.avaiable_balance);

router.post('/api/trade/otc/top-orders', tradeController.topOrder);
router.post('/api/trade/otc/top-trade-history-otc',tradeController.lastestTradeHistoryOtc);
router.post('/api/trade/real-time-market/top-trade-history-realtime',tradeController.lastestTradeHistoryRealtime);
router.post('/api/trade/otc/total-daily-transaction',tradeController.totalDailyTransaction);

// router.get('/api/trade/otc/orders/:Account', middleware.checkRole(["trader"]), tradeController.sendRequestMyOrders);
// router.post('/api/trade/otc/cancel-otc-order',middleware.checkRole(["trader"]) ,tradeController.sendRequestCancelOTCOrder);
// router.post('/api/trade/otc/otc-order',middleware.checkRole(["trader"]) ,tradeController.sendRequestOTCOrder);

router.post('/account/open',middleware.checkRole(["trader"]) , usercontroller.openaccount)
router.post('/account/transaction',middleware.checkRole(["trader"]) ,usercontroller.account_transaction)
router.post('/account/create-transaction', middleware.checkRole(["trader"]) ,usercontroller.create_transaction)

router.post("/account/history/deposit",middleware.checkRole(["trader"]) , usercontroller.history_transaction)
router.post('/account/info-wallet',middleware.checkRole(["trader"]) ,usercontroller.wallet_info)
router.post('/account/check-kyc',middleware.checkRole(["trader"]) ,usercontroller.check_kyc)
router.post('/account/add-kyc',middleware.checkRole(["trader"]),upload.fields([{name:'step1'},{name:'step2'},{name:'step3'},{name:'step4'}]) ,usercontroller.add_kyc)
router.post('/account/update-kyc',middleware.checkRole(["trader"]),upload.fields([{name:'step1'},{name:'step2'},{name:'step3'},{name:'step4'}]) ,usercontroller.update_kyc)
router.post('/account/get-new-code',middleware.checkRole(["trader"]),usercontroller.getNewCodeDeposit)
router.post('/account/get-code',middleware.checkRole(["trader"]),usercontroller.getCodeDeposit)


router.post('/account/check-existed-account-currency',middleware.checkRole(["trader"]),usercontroller.check_exsited_account_currency)
router.post('/account/check-existed-banking',middleware.checkRole(["trader"]),usercontroller.check_exsited_banking)
router.post('/account/add-new-banking-account',middleware.checkRole(["trader"]),usercontroller.new_banking)



module.exports = router;