const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            })
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1", [normalizedEmail]
        )

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await pool.query(
            `INSERT INTO users(name,email,password)
             VALUES($1,$2,$3)
             RETURNING id,name,email,created_at;
             `, [name, normalizedEmail, hashedPassword]
        )

        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            data: newUser.rows[0]
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: `internal server error`
        })
    }
}



const loginUser = async (req,res) => {
    try{
        const { email , password } = req.body;

        if (!email || !password)
        {
            return res.status(400).json({
                success : false,
                message : "please enter all the fields"
            })
        }

        const normalizedEmail = email.trim().toLowerCase();

        const userResult = await pool.query(
            `SELECT * FROM users WHERE email=$1`,[normalizedEmail]
        )

        if (userResult.rows.length===0)
        {
            return res.status(401).json({
                success : false ,
                message : "invalid email or password"
            })
        }

        const user = userResult.rows[0];

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if (!isPasswordCorrect)
        {
            return res.status(401).json({
                success : false ,
                message : "invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id : user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        );

            res.cookie("token" ,token, {
                httpOnly : true,
                secure : process.env.NODE_ENV === "production",
                sameSite : "strict",
                maxAge : 7 * 24 * 60 * 60 * 1000
            }
        )

        return res.status(200).json({
            success : true ,
            message : "login successful" ,
            data : {
                id : user.id ,
                name : user.name ,
                email : user.email 
            }
        })

    }
    catch(error){
        console.error(error)

        return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    });
    }
}




module.exports = {
    registerUser,
    loginUser
}