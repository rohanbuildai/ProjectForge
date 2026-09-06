const  { analyzeProject } = require("../../services/Ai/aiService") ;

const analyzeProjectController = async ( req , res ) => {

    const { workspaceId, projectId } = req.params;
    const { id } = req.user;

    try {

        const analysis = await analyzeProject({
        userId: id,
        workspaceId,
        projectId
        });

        return res.status(200).json({
        success: true,
        data: analysis
        });
    }catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

};

module.exports = {
  analyzeProjectController
};