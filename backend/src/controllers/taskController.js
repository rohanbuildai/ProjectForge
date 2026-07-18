const pool = require("../config/db");

const createTask = async (req, res) => {

    try {

        const { projectId, title, description, priority, dueDate } = req.body;
        const validPriorities = ["low", "medium", "high"];
        const { id } = req.user;
        const normalizedTitle = title?.trim();

        if (!projectId || !normalizedTitle) {
            return res.status(400).json({
                success: false,
                message: "Please enter projectID and title"
            })
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid priority"
            })
        }

        const project = await pool.query(
            `SELECT * FROM projects
         WHERE id = $1`, [projectId]
        )

        if (project.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project does not exist"
            })
        }

        const strictlyValidateProject = await pool.query(
            `SELECT * FROM projects
         WHERE id = $1
         AND user_id = $2`, [projectId, id]
        )

        if (strictlyValidateProject.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this project."
            })
        }

        const task = await pool.query(
            `INSERT INTO tasks(
            project_id,
            title,
            description,
            priority,
            due_date
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *;`, [projectId, normalizedTitle, description, priority, dueDate]
        )

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task.rows[0]
        });
    }catch(error){
        console.error(error)

        return res.status(500).json({
            success : false ,
            message : "Internal server error"
        })
    }
}

module.exports = { createTask };