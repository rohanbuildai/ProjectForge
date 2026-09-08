const pool = require("../../config/db");
const { buildProjectContext } = require("./aiContextService");
const { buildProjectAnalysisPrompt } = require("./aiPromptService");
const { generate } = require("./Providers/openRouterProvider");
const { parseProjectAnalysis } = require("./aiResponseService");
const workspaceModel = require("../../models/workspace.model");
const projectModel = require("../../models/project.model");


const analyzeProject = async ({ workspaceId, projectId, userId }) => {

  const client = await pool.connect() ;
    
  try {

    const workspace = await workspaceModel.getWorkspaceById({
      client ,
      userId ,
      workspaceId
    })

    if ( !workspace ) {
      throw new Error("Workspace Not Found")
    }

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
