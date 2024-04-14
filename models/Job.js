const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [100, "Title should not exceed 100 characters"],
      trim: true,
    },
    techStack: {
      type: String,
      required: true,
      maxlength: [100, "Tech stack should not exceed 100 characters"],
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      maxlength: [100, "Company name should not exceed 100 characters"],
      trim: true,
    },
    companyWebsite: {
      type: String,
      required: false,
      maxlength: [150, "Company website should not exceed 150 characters"],
      trim: true,
    },

    status: {
      type: Boolean,
      default: false,
    },
    deadLine: Date,

    appliedDate: Date,

    userId: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

JobSchema.plugin(mongoosePaginate);

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
