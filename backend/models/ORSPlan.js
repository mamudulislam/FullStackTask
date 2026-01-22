const mongoose = require('mongoose');

const textDocSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const documentSchema = new mongoose.Schema({
  textDocs: [textDocSchema],
  attachments: [String],
});

const orsPlanSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: [true, 'Please provide vehicle name'],
      trim: true,
    },
    roadWorthinessScore: {
      type: String,
      required: [true, 'Please provide roadworthiness score'],
    },
    overallTrafficScore: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F'],
      required: true,
    },
    actionRequired: {
      type: String,
      default: 'None',
    },
    documents: [documentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ORSPlan', orsPlanSchema);
