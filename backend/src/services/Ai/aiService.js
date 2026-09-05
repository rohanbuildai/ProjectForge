const { buildProjectContext } = require("./aiContextService");
const { buildProjectAnalysisPrompt } = require("./aiPromptService");
const { generate } = require("./Providers/openRouterProvider");

const analyzeProject = async ({ workspaceId, projectId, userId }) => {
    
  try {

    const context = await buildProjectContext({
      workspaceId,
      projectId,
    });

    const prompt = buildProjectAnalysisPrompt({
      context
    })

    const response = await generate({
      prompt
    })

    return response;

  } catch (error) {
    console.error(error);

    throw error;
  }
};

module.exports = {
  analyzeProject,
};
