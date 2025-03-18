const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    paymentName: { type: String, required: true },
    investedAmount: { type: Number, required: true },
    paybackAmount: { type: Number, default: 0 },
    days: { type: Number, required: true },
    paybackHistory: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    isApproved: { type: Boolean, default: false },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment;
