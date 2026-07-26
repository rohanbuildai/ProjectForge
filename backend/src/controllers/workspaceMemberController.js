const workspaceMemberService = require("../services/workspaceMember.service");




const addWorkspaceMember = async (req, res) => {
  try {


    const { id } = req.user;
    const { workspaceId } = req.params;

    const { email, role } = req.body;

    const member = await workspaceMemberService.addWorkspaceMember({
      userId: id,
      workspaceId,
      email,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Member successfully added to workspace",
      data: member,
    });



  } catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}
}


const getWorkspaceMembers = async ( req , res ) => {
  
  try{

    const { workspaceId } = req.params ;
    const { id } = req.user ;

    const members = await workspaceMemberService.getWorkspaceMembers({

      userId : id,
      workspaceId
    })

    return res.status(200).json({
      success: true,
      message: "Members fetched successfully",
      data: members,
    });


  }catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}

};


const updateMemberRole = async ( req , res ) => {
  try{

    const { id } = req.user ;
    const { workspaceId , memberId } = req.params ;
    const  { role } = req.body ;

      if (!role) {
        return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const updatedRole = await workspaceMemberService.updateMemberRole({
      workspaceId,
      userId : id,
      memberId,
      role
    })

    return res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: updatedRole,
    });




  }catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });

}


}



module.exports = {
    addWorkspaceMember,
    getWorkspaceMembers,
    updateMemberRole
}