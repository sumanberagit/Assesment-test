const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',  // Ensure it references an existing Category
        required: true
    },
    images: [{
        type: String
    }],
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure price cannot be negative
    },
    pvValue: {
        type: Number
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
