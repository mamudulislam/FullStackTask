const express = require('express');
const router = express.Router();
const {
  getAllPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} = require('../controllers/orsController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getAllPlans);
router.get('/:id', getPlan);

// Create, Update, Delete - Admin and Inspector only
router.post('/', authorize('admin', 'inspector'), createPlan);
router.put('/:id', authorize('admin', 'inspector'), updatePlan);
router.delete('/:id', authorize('admin', 'inspector'), deletePlan);

module.exports = router;
