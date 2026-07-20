const pool = require("../config/db");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please enter title",
      });
    }

    const newProject = await pool.query(
      `INSERT INTO projects(user_id,title,description)
             values($1,$2,$3)
             RETURNING *
             `,
      [userId, title, description],
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const id = req.user.id;
    const { search } = req.query;
    let projects;

    if (search) {
      const result = await pool.query(
        `SELECT *
         FROM projects
         WHERE user_id=$1
         AND title ILIKE $2
         ORDER BY created_at DESC;`,
        [id, `%${search}%`],
      );

      projects = result.rows;
    } else {
      const result = await pool.query(
        `SELECT * FROM projects
         WHERE user_id =$1
         ORDER BY created_at DESC`,
        [id],
      );

      projects = result.rows;
    }

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await pool.query(
      `SELECT * FROM projects
             WHERE id= $1
             AND user_id= $2`,
      [id, userId],
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }

    const project = await pool.query(
      `SELECT * FROM projects
             WHERE id= $1
             AND user_id= $2`,
      [id, userId],
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updatedTitle = title || project.rows[0].title;
    const updatedDescription = description || project.rows[0].description;

    const updatedProject = await pool.query(
      `UPDATE projects
             SET 
                title = $1,
                description = $2,
                updated_at = CURRENT_TIMESTAMP
             WHERE
                id = $3
                AND user_id = $4
             RETURNING *`,
      [updatedTitle, updatedDescription, id, userId],
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: updatedProject.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedProject = await pool.query(
      `DELETE FROM projects
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
      [id, userId],
    );

    if (deletedProject.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      data: deletedProject.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
