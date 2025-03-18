const Product = require('../models/Product');
const Category = require('../models/Category')

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { productName, description, image, categoryId, images, price, pvValue } = req.body;

        // Check if the categoryId exists in the Category collection
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ error: "Invalid category ID. Category does not exist." });
        }

        const newProduct = new Product({
            productName,
            description,
            image,
            categoryId,
            images,
            price,
            pvValue
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all products with optional sorting, filtering, and pagination
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'price', order = 'asc', category } = req.query;
    
    const filter = category ? { categoryId: category } : {};
    const products = await Product.find(filter)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID (only provided fields)
exports.updateProduct = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const productId = req.params.id;

        // If categoryId is being updated, check if the new category exists
        if (categoryId) {
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                return res.status(400).json({ error: "Invalid category ID. Category does not exist." });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get average price of all products
exports.getAveragePrice = async (req, res) => {
  try {
    const result = await Product.aggregate([{ $group: { _id: null, avgPrice: { $avg: '$price' } } }]);
    res.status(200).json({ averagePrice: result[0]?.avgPrice || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total PV Value of all products
exports.getTotalPVValue = async (req, res) => {
  try {
    const result = await Product.aggregate([{ $group: { _id: null, totalPV: { $sum: '$pvValue' } } }]);
    res.status(200).json({ totalPVValue: result[0]?.totalPV || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get highest priced product in each category
exports.getHighestPricedProductsByCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $sort: { price: -1 } },
      { $group: { _id: '$categoryId', highestPricedProduct: { $first: '$$ROOT' } } },
    ]);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Group products into price ranges
exports.getProductsByPriceRange = async (req, res) => {
  try {
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-500', min: 101, max: 500 },
      { range: '501-1000', min: 501, max: 1000 },
      { range: '1000+', min: 1001, max: Number.MAX_VALUE },
    ];

    const results = {};
    
    for (let range of priceRanges) {
      results[range.range] = await Product.find({ price: { $gte: range.min, $lt: range.max } });
    }
    
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for products by name or description
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
