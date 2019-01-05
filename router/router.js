const express  = require('express'),router= express.Router();
const ejs = require("ejs")
const request = require('request')

/**
 * Controllers (route handlers).
 */
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const tradeController = require('../controllers/trade')

const middleware = require("../middleware/middleware")

router.get('/',middleware.checkRole(["admin","trader","guest"]), homeController.index);
// page login
router.get('/login',middleware.checkRole(["guest"]), userController.getLogin);
router.get('/login/:status', middleware.checkRole(["guest"]),userController.getLogin);
router.post('/login', middleware.checkRole(["guest"]),userController.postLogin);
router.post('/logout', middleware.checkRole(["admin","trader"]),userController.postLogout);
router.get('/reset-password',middleware.checkRole(["admin","trader","guest"]),userController.resetPassword);
router.get('/en/trade',middleware.checkRole(["admin","trader","guest"]),tradeController.showOrderBook);

// page register
router.get('/signup',middleware.checkRole(["guest"]), userController.getSignup);
router.get('/signup/:error/:email',middleware.checkRole(["guest"]), userController.getSignup);
router.post('/signup',middleware.checkRole(["guest"]), userController.postSignup);
router.post('/resend',middleware.checkRole(["guest"]), userController.resend);
router.get('/confirmaccount/:email/:token',middleware.checkRole(["admin","trader","guest"]), userController.confimAccount);

router.get('/blog' ,middleware.checkRole(["admin","trader","guest"]), userController.getBlog);
router.post('/blog', middleware.checkRole(["admin","trader","guest"]),userController.postBlog);

router.get('/dashboard', middleware.checkRole(["admin","trader","guest"]),userController.getDasboard)
router.post('/dashboard',middleware.checkRole(["admin","trader","guest"]), userController.postDashboard)

router.get('/market',middleware.checkRole(["admin","trader","guest"]), homeController.market)
router.post('/render-module',middleware.checkRole(["admin","trader","guest"]),homeController.render)
module.exports = router;