const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        const normalizedEmail=email.trim().toLowerCase();
        
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1", [normalizedEmail]
        )

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)
        
        const newUser = await pool.query(
            `INSERT INTO users(name,email,password)
             VALUES($1,$2,$3)
             RETURNING id,name,email,created_at;
             `,[name,normalizedEmail,hashedPassword]
        )

        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            data : newUser.rows[0]
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success : false ,
            message : `internal server error`
        })
    }
}

module.exports = {
    registerUser
}