const ORSPlan = require('../models/ORSPlan');

// Get all ORS Plans
exports.getAllPlans = async (req, res) => {
  try {
    let query;

    // If viewer, show all plans
    if (req.user.role === 'viewer') {
      query = ORSPlan.find();
    } else if (req.user.role === 'inspector') {
      // Inspector can see their created plans
      query = ORSPlan.find({
        $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
      });
    } else {
      // Admin can see all
      query = ORSPlan.find();
    }

    const plans = await query.populate('createdBy', 'username email role').populate('assignedTo', 'username email role');

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single ORS Plan
exports.getPlan = async (req, res) => {
  try {
    const plan = await ORSPlan.findById(req.params.id)
      .populate('createdBy', 'username email role')
      .populate('assignedTo', 'username email role');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'viewer' &&
      plan.assignedTo.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this plan',
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create ORS Plan
exports.createPlan = async (req, res) => {
  try {
    const { vehicle, roadWorthinessScore, overallTrafficScore, actionRequired, documents, assignedTo } = req.body;

    // Validate input
    if (!vehicle || !roadWorthinessScore || !overallTrafficScore) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const plan = await ORSPlan.create({
      vehicle,
      roadWorthinessScore,
      overallTrafficScore,
      actionRequired: actionRequired || 'None',
      documents: documents || [],
      createdBy: req.user.id,
      assignedTo: assignedTo || req.user.id,
    });

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update ORS Plan
exports.updatePlan = async (req, res) => {
  try {
    let plan = await ORSPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'inspector' &&
      plan.createdBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this plan',
      });
    }

    plan = await ORSPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete ORS Plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await ORSPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'inspector' &&
      plan.createdBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this plan',
      });
    }

    await ORSPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
