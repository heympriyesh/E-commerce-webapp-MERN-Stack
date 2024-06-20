import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CoupounSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

CoupounSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

CoupounSchema.virtual("daysLeft").get(function () {
  const daysLeft =
    Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
    " Days left";
  return daysLeft;
});

CoupounSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date cannot be less then the start date"));
  }
  next();
});

CoupounSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    next(new Error("Start date cannot be less then today"));
  }
  next();
});

CoupounSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    next(new Error("End date cannot be less then today"));
  }
  next();
});

CoupounSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100)
    next(new Error("Discoutn cannot be greater then 100 or less then 0"));

  next();
});

const Coupon = mongoose.model("Coupon", CoupounSchema);

export default Coupon;
