const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userType = ['user', 'guide', 'lead-guide', 'admin'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        minlength: [2, 'name must have at least 2 length']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default:'default.jpg'
    },
    role: {
        type: String,
        enum: Object.values(userType),
        default: userType[0]
    },
    password: {
        type: String,
        required: [true, 'Enter Password'],
        minlength: [8, 'Password must have at least 8 length'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password '],
        validate: {
            // This only work on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});

userSchema.pre('save', async function (next) {
    // Only run if password was actully modifyed
    if (!this.isModified('password')) return next();

    // Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)

};

userSchema.methods.passwordChangeAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimeStamp < changedTimestamp
    }
    // False means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;