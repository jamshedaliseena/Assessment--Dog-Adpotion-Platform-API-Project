const mongoose = require('mongoose'); const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({ username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 }, password: { type: String, required: true, minlength: 6, select: false } }, { timestamps: true });
userSchema.pre('save', async function (next) { if (!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 12); next(); });
userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
module.exports = mongoose.model('User', userSchema);
