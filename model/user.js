var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');
var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    name:  {
        type: String,
        default: "User Name"
    },
    YOB:  {
        type: String,
        default:"2001"
    },
    isAdmin:  {
        type: Boolean,
        required: true,
        default: false
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiration: {
        type: Date,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });
userSchema.statics.updateOTP = function(email, otp, expirationDate) {
    return this.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp, otpExpiration: expirationDate } }
    );
  };
// userSchema.methods = {
//     createPasswordChangedToken: function(){
//     const resetToken = crypto.randomBytes(32).toString('hex')
//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//     this.resetPasswordExpires = Date.now() + 15 * 60 * 1000
//     return resetToken
//     }
//}
module.exports = mongoose.model('users', userSchema);
