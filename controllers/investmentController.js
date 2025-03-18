const Investment = require('../models/Investment');

// Create a new investment
exports.createInvestment = async (req, res) => {
  try {
    const newInvestment = new Investment(req.body);
    await newInvestment.save();
    res.status(201).json({ message: 'Investment created successfully', investment: newInvestment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all investments
exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate('userId', 'username email');
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an investment by ID
exports.getInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id).populate('userId', 'username email');
    if (!investment) return res.status(404).json({ message: 'Investment not found' });

    res.status(200).json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an investment by ID
exports.updateInvestment = async (req, res) => {
  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvestment) return res.status(404).json({ message: 'Investment not found' });

    res.status(200).json({ message: 'Investment updated successfully', investment: updatedInvestment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an investment by ID
exports.deleteInvestment = async (req, res) => {
  try {
    const deletedInvestment = await Investment.findByIdAndDelete(req.params.id);
    if (!deletedInvestment) return res.status(404).json({ message: 'Investment not found' });

    res.status(200).json({ message: 'Investment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate the total payback amount for a specific user
exports.getTotalPaybackForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Investment.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalPayback: { $sum: '$paybackAmount' } } },
    ]);

    res.status(200).json({ totalPayback: result[0]?.totalPayback || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve the latest payback entry for a specific investment
exports.getLatestPaybackEntry = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const investment = await Investment.findById(investmentId);
    
    if (!investment || investment.paybackHistory.length === 0) {
      return res.status(404).json({ message: 'No payback history found' });
    }

    const latestEntry = investment.paybackHistory[investment.paybackHistory.length - 1];
    res.status(200).json({ latestEntry, totalPayback: investment.paybackAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
