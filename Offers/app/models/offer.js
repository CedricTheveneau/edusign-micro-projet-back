const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");

const offerSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, "The title field is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  company: {
    type: String,
    required: [true, "The company field is required"],
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ["présentiel", "full remote", "hybrid remote"],
    required: [true, "The type field is required"],
  },
  contract: {
    type: String,
    enum: ["alternance", "CDD", "CDI", "freelance"],
    required: [true, "The contract field is required"],
  },
  location: {
    type: String,
    required: [true, "The location field is required"],
    trim: true,
    lowercase: false,
  },
  skills: {
    type: Array,
    required: [true, "The skills field is required"],
    default: [],
  },
  slug: {
    type: String,
    required: [true, "The slug field is required"],
    unique: [true, "You are trying to copy an already existing slug"],
    trim: true,
    lowercase: true,
  },
  publishDate: {
    type: Date,
    required: [true, "The publish date field is required"],
    default: Date.now(),
  },
  lastModifiedDate: {
    type: Date,
    required: [true, "The last modified date field is required"],
    default: Date.now(),
  },
  applied: {
    type: [String],
    required: [true, "The applied field is required"],
    default: [],
  },
  saved: {
    type: [String],
    required: [true, "The saved field is required"],
    default: [],
  },
});

offerSchema.plugin(uniqueValidator);

offerSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

offerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
    if (this._conditions._id) {
      update.slug = `${update.slug}-${this._conditions._id}`;
    }
  }
  next();
});

offerSchema.post("save", async function () {
  if (!this.slug.includes(this._id)) {
    this.slug = `${this.slug}-${this._id}`;
    await this.save();
  }
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;