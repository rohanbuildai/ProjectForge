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

  const status = error.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}
}


const getWorkspaceMembers = async ( req , res ) => {
  
  try{

    const { workspaceId } = req.params ;
    const { id } = req.user ;
    const { search, role, status, sortBy, order, page, limit } = req.query;

    const result = await workspaceMemberService.getWorkspaceMembersDetailed({
      userId: id,
      workspaceId,
      search,
      role,
      status,
      sortBy,
      order,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Members fetched successfully",
      data: result.members,
      pagination: result.pagination,
      statistics: result.statistics,
      currentUserRole: result.currentUserRole,
    });


  }catch (error) {
  console.error(error);

  const status = error.statusCode || 500;
  return res.status(status).json({
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

  const status = error.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: error.message || "Internal Server Error",
  });

}

}


const deleteWorkspaceMember = async ( req , res ) => {

    try{


        const { id } = req.user ;
        const { workspaceId , memberId } = req.params ;

        const deletedMember = await workspaceMemberService.deleteWorkspaceMember({
          workspaceId,
          userId : id,
          memberId,
        })

          return res.status(200).json({
            success: true,
            message: "Member deleted successfully",
            data: deletedMember,
        });




    }catch (error) {
  console.error(error);

  const status = error.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: error.message || "Internal Server Error",
  });

}

}



module.exports = {
    addWorkspaceMember,
    getWorkspaceMembers,
    updateMemberRole,
    deleteWorkspaceMember
}