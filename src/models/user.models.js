const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [5, 'Email must be at least 5 characters'],
      maxlength: [40, 'Email must be at most 40 characters'],
    },
    password: {
      type: String,
      required: true,
      minlength: [5, 'Password must be at least 5 characters'],
      select: false, // Do not return password in queries
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false, // __v
    toObject: {
      transform(obj, ret) {
        ret.id = ret._id
        delete ret.password,
          delete ret.__v
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      },
    },
    toJSON: {
      transform(obj, ret) {
        ret.id = ret._id
        delete ret.password,
          delete ret.__v
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next;

  let salt = await bcryptjs.genSalt(10);
  let hashedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
