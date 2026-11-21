
const mongoose = require('mongoose');

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

        validate(value){
            if(!validator.isEmail(value)){
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
        validator(value) {
            if (!["Male", "Female", "Other"].includes(value)) {
                throw new Error("Gender is invalid");
            }
        }
    },
    occupation:{
        type:String,
        required:true
    }

},
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;