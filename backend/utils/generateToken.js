import jwt from "jsonwebtoken";

const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production';
    return jwt.sign(payload, secret, {
        expiresIn: "7d"
    })
}

export default generateToken;