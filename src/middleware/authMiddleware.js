import jwt from 'jsonwebtoken';
import {prisma} from '../config/db.js';

// Read token from request header
// Check if token is valid
export const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware called");
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];;
    }else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(401).json({ error: "Not authorized, user not found" });
        }
        req.user = user;
        next();
    }catch {
        return res.status(401).json({ error: "Not authorized, invalid token" });
    }

};