const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

router.post('/', investmentController.createInvestment);
router.get('/', investmentController.getInvestments);
router.get('/:id', investmentController.getInvestmentById);
router.put('/:id', investmentController.updateInvestment);
router.delete('/:id', investmentController.deleteInvestment);

router.get('/user/:userId/payback', investmentController.getTotalPaybackForUser);
router.get('/:investmentId/latest-payback', investmentController.getLatestPaybackEntry);

module.exports = router;
