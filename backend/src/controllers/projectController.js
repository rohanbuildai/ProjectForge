const pool = require("../config/db");
const createProject = async (req,res) => {
    try{

        const { title , description} = req.body;
        const userId = req.user.id;

        if (!title)
        {
            return res.status(400).json({
                success : false ,
                message : "Please enter title"
            })
        }

        const newProject = await pool.query(
            `INSERT INTO projects(user_id,title,description)
             values($1,$2,$3)
             RETURNING *
             `,[userId,title,description]    
        )

        return res.status(201).json({
            success : true ,
            message : "Project created Successfully" ,
            data : newProject.rows[0]
        })

    }catch(error){
        console.error(error)

        return res.status(400).json({
            success : false ,
            message : "Internal server error"
        })
    }
}

module.exports = {
    createProject
}