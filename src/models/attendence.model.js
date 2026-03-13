const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Present', 'Absent'],
        message: 'Status must be either Present or Absent',
      },
    },
  },
  { timestamps: true }
);

// One record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);