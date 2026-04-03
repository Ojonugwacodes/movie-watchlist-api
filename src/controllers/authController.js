import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
// Register
const register = async (req,res) => {
    try {
        const { name, email, password }= req.body;
        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if(userExists){
            return res
            .status(400)
            .json({error: "User already exists with this email"});
        };

        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create User
        const user = await prisma.user.create(
        {
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })
        // Generate JWT token
        const token = generateToken(user.id, res);
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    name: name,
                    email: email,
                },
                token,
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
}
// Login
const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
        where: {
            email: email
        }});
        // Check if user's email exists in table
        if(!user){
            return res.status(400).json({error: "Invalid email or password"});
        };
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({error: "Invalid email or password"});
        };
        // Generate JWT token
        const token = generateToken(user.id, res);
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                },
                token,
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
// Logout 
const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
};

// Delete user
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await prisma.user.delete({
            where: {
                id: userId
            }
        });
        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
export { register, login, logout, deleteUser };
