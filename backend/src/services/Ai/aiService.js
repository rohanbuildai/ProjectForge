const { buildProjectContext } = require("./aiContextService");
const { buildProjectAnalysisPrompt } = require("./aiPromptService");
const { generate } = require("./Providers/openRouterProvider");
const { parseProjectAnalysis } = require("./aiResponseService");

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

    const analysis =  parseProjectAnalysis({
      response
    })

    return analysis;

  } catch (error) {
    console.error(error);

    throw error;
  }
};

module.exports = {
  analyzeProject,
};
