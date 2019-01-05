const express  = require('express'),router= express.Router();
const admin_controller = require('../controllers/admin')
const middleware = require("../middleware/middleware")

router.get('/admin',middleware.checkRole(["admin"]),admin_controller.showAdminPage);
router.post('/admin/all-withdraw',middleware.checkRole(["admin"]),admin_controller.showAllTransaction);
router.post('/admin/all-kyc',middleware.checkRole(["admin"]) ,admin_controller.list_kyc)
router.post('/admin/verify-kyc',middleware.checkRole(["admin"]) ,admin_controller.verify_kyc)

module.exports = router;