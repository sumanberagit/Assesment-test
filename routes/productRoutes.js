const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/stats/average-price', productController.getAveragePrice);
router.get('/stats/total-pv', productController.getTotalPVValue);
router.get('/stats/highest-priced', productController.getHighestPricedProductsByCategory);
router.get('/stats/price-range', productController.getProductsByPriceRange);
router.get('/search', productController.searchProducts);

module.exports = router;
