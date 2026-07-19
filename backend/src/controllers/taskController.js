const pool = require("../config/db");
const { get } = require("../routes/taskRoutes");

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
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}




const getTasksByProject = async (req, res) => {

    try {

        const projectId = Number(req.params.projectId);
        const { id } = req.user;

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter valid input"
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

        const tasks = await pool.query(
            `SELECT *
                 FROM tasks
                 WHERE project_id = $1
                 ORDER BY created_at DESC`,
            [projectId]
        );

        return res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks.rows
        });


    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



const getSingleTask = async (req, res) => {
    try {

        const taskId = Number(req.params.taskId);
        const { id } = req.user;

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter valid input"
            })
        }

        const task = await pool.query(
            `SELECT * FROM tasks
             WHERE id = $1`, [taskId]
        )

        if (task.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task does not exist"
            })
        }

        const projectId = task.rows[0].project_id;

        const strictlyValidateProject = await pool.query(
            `SELECT id FROM projects
             WHERE id = $1
             AND user_id = $2`, [projectId, id]
        )

        if (strictlyValidateProject.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this project."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            data: task.rows[0]
        });

    }
    catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



const updateTask = async (req, res) => {
    try {

        const taskId = Number(req.params.taskId);
        const { title, description, priority, status, dueDate } = req.body;
        const validPriorities = ["low", "medium", "high"];
        const validStatus = ["todo", "in_progress", "completed"];
        const { id } = req.user;

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter valid input"
            })
        }

        if (title === undefined && description === undefined && priority === undefined
            && status === undefined && dueDate === undefined) {
            return res.status(400).json({
                success: false,
                message: "Enter field to be updated"
            })
        }

        if (dueDate !== undefined && isNaN(Date.parse(dueDate))) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid due date."
            });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Priority must be one of: low, medium, high."
            })
        }

        if (status && !validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be one of: todo, in_progress, completed."
            })
        }

        const task = await pool.query(
            `SELECT * FROM tasks
             WHERE id = $1`, [taskId]
        )

        if (task.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task does not exist"
            })
        }

        const projectId = task.rows[0].project_id;

        const strictlyValidateProject = await pool.query(
            `SELECT id FROM projects
             WHERE id = $1
             AND user_id = $2`, [projectId, id]
        )

        if (strictlyValidateProject.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this project."
            })
        }

        const updatedTask = await pool.query(
            `UPDATE tasks
             SET
             title = COALESCE($1, title),
             description = COALESCE($2, description),
             priority = COALESCE($3, priority),
             status = COALESCE($4, status),
             due_date = COALESCE($5, due_date)
             WHERE id = $6
             RETURNING *;`, [
            title,
            description,
            priority,
            status,
            dueDate,
            taskId
        ]
        )

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask.rows[0]
        });
    }
    catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


const deleteTask = async (req, res) => {
    try {

        const taskId = Number(req.params.taskId);
        const { id } = req.user;

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter valid input"
            })
        }

        const task = await pool.query(
            `SELECT project_id FROM tasks
             WHERE id = $1`, [taskId]
        )

        if (task.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task does not exist"
            })
        }

        const projectId = task.rows[0].project_id;

        const strictlyValidateProject = await pool.query(
            `SELECT id FROM projects
             WHERE id = $1
             AND user_id = $2`, [projectId, id]
        )

        if (strictlyValidateProject.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this project."
            })
        }

        const deletedTask = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             RETURNING *;`,[taskId]
        )

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask.rows[0]
        });
    }
    catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createTask,
    getTasksByProject,
    getSingleTask,
    updateTask
};