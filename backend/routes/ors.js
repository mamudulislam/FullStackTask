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
router.use(protect);

router.get('/', getAllPlans);
router.get('/:id', getPlan);
router.post('/', authorize('admin', 'inspector'), createPlan);
router.put('/:id', authorize('admin', 'inspector'), updatePlan);
router.delete('/:id', authorize('admin', 'inspector'), deletePlan);

module.exports = router;
