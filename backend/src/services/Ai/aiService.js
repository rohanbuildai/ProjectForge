const { buildProjectContext } = require("./aiContextService");

const analyzeProject = async ({ workspaceId, projectId, userId }) => {
    
  try {

    const context = await buildProjectContext({
      workspaceId,
      projectId,
    });

    return context;

  } catch (error) {
    console.error(error);

    throw error;
  }
};

module.exports = {
  analyzeProject,
};
