
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const validator = require("validator");

const userSchema = new Schema({
    firstName: {
        type: String,
        lowercase: true,
        minLength: 3,
        required: true,
        maxLength: 40
    },
    lastName: {
        type: String,
        lowercase: true,
        minLength: 3,
        required: true,
        maxLength: 40
    },

    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true,

        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },

    password: {
        type: String,
        minLength: 8,
        required: true,
        validator(value) {
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!strongPasswordRegex.test(value)) {
                throw new Error("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        required: true,
        max: 100
    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female", "other"],
            meaasge: ` {VALUE} is not a valid gender type `
        }
    },
    occupation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'inactive',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true,
    }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "SAHIL@769", { expiresIn: "7d", });
    return token;
}
userSchema.methods.checkPassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
    if (isPasswordValid) {
        return true;
    }
}
const User = mongoose.model("User", userSchema);

module.exports = User;