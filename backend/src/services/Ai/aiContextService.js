const projectModel = require("../../models/project.model") ;
const taskModel = require("../../models/task.model") ;

const buildProjectContext = async ( { workspaceId , projectId } ) => {

    try {

        const project = await projectModel.getProjectById({
            projectId ,
            workspaceId
        })

        if (!project) {
            throw new Error("Project not found");
        }

        const statistics = await taskModel.getProjectTaskStatistics({
            projectId
        })

        const tasks = await taskModel.getTasksForAI({
            projectId
        })

        const formattedTasks = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        assignee: task.assignee_id
            ? {
                id: task.assignee_id,
                name: task.assignee_name
            }
            : null
        }));

        return {
            project: {
                id: project.id,
                title: project.title,
                description: project.description,
                status: project.status,
                createdAt: project.created_at,
                updatedAt: project.updated_at
            } ,
            statistics ,

            tasks : formattedTasks
        };

        

    }catch(error) {
        console.error(error) ;
        throw error ;
    }

}


module.exports = {
    buildProjectContext
};