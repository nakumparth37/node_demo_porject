const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    userID : {
        type: Number, 
        unique:true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    image: {
        type: String, 
        default: 'default.png', 
    },
    address: {
        type: String,
        default: 'Not Provided'
    },
    roleID: { 
        type: Number, 
        ref: "Role", 
        required: true, 
        default: 3 
    }
}, { timestamps: true });
UserSchema.plugin(AutoIncrement,{inc_field: 'userID'})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


const User = mongoose.model('User', UserSchema);
module.exports = User;
