const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require("../model/user");
var passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const forgotPassword = asyncHandler(async (req, res) =>
    {
        const {email} = req.query
        if(!email) throw new Error('Missing email')
        const user = await User.findOne({email})
        if(!user) throw new Error('User not found')
        const resetToken = user.createPasswordChangedToken()
        await user.save()
        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

        const data = {
            email,
            html
        }
        const rs = await sendMail(data)
        return res.status(200).json({
            success: true,
            rs
        })
        
    }
);
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing imputs')
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
});
module.exports = {
    forgotPassword,
    resetPassword
}