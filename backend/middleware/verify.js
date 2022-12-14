const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');
dotenv.config();

const verify = async (req, res, next)=>{

    try {
        const SecKey = process.env.jwt_web_token;
        const token = req.header('auth-token');
        const ans =  jwt.verify(token, SecKey)
        if (ans) {
            const user = await User.findById(ans._id)
            if (user) {
                if (user.tokens[0].token === token || user.tokens[1].token === token) {
                    res.json({user, message:'success'});
                    next();
                }
                else{
                    res.json({message:'tokenExpired'})
                    next();
                }
            }
            else{
                res.json({message: 'nouser'})
            }
        }
        else {
            res.json({message:'fail'})
        }
    } catch (error) {
        // console.log(error);
        res.json(error.message)
    }
}

 module.exports = verify;
