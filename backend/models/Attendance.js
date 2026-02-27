const attendanceSchema = new mongoose.Schema({
    employeeId: {
      type: String,
      required: true,
      ref: "Employee"
    },
    date: {
      type: String, // store as YYYY-MM-DD
      required: true
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true
    }
  }, { timestamps: true });
  
  // To Prevent duplicate attendance for same employee on same date
  attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
  
  module.exports = mongoose.model("Attendance", attendanceSchema);