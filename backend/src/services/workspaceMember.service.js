const workspaceMemberModel = require("../models/workspaceMember.model");
const userModel = require("../models/user.model");
const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const notificationService = require("../services/notifications.service");




const addWorkspaceMember = async ({ userId, workspaceId, email, role }) => {
  const client = await pool.connect();

  try {

    const memberRole = await workspaceMemberModel.getMemberRole({
      client,
      workspaceId,
      userId,
    });

    if ( !memberRole) {
      throw new Error("You are not a member of workspace")
    }

    if ( memberRole.role === "MEMBER" ) {
      throw new Error("You don't have the permission to add members")
    }

    const user = await userModel.getUserByEmail({
      client,
      email,
    })

    if (!user) {
      throw new Error("User does not exist")
    }

    const existingMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : user.id,
      workspaceId
    })

    if ( existingMember ) {
      throw new Error("User already exists as a member")
    }

    if ( role == "OWNER") {
      throw new Error("Two owners cannot exist in one workspace")
    }

    const addedMember = await workspaceMemberModel.addMember({
      client,
      workspaceId,
      userId : user.id,
      role
    })

    await notificationService.createNotification({
            userId: user.id,
            type: "PROJECT_MEMBER_ADDED",
            title: "You were added to a workspace",
            message: `You were added to workspace ${workspaceId}`,
            entityType: "Workspace",
            entityId: workspaceId,
            metadata: {
                workspaceId ,
                role
            }
        })

    return addedMember;


  } catch (error) {

    console.error(error);

    throw error;

  } finally {

    client.release();

  }
};


const getWorkspaceMembers = async ( { userId , workspaceId } ) => {
  const client = await pool.connect() ;

  try{

    const userWorkspace = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId
    })

    if ( !userWorkspace ) {
      throw new Error("You are not a member of that workspace")
    }

    const workspaceMembers = await workspaceMemberModel.getWorkspaceMembers({
      client,
      workspaceId
    })

    return workspaceMembers


  }catch (error) {

    console.error(error);

    throw error;


  }finally{
    client.release() ;
  }
}


const updateMemberRole = async ( { workspaceId , userId , memberId , role } ) => {

  const validRoles = [ "MEMBER" , "ADMIN" ] ;
  const client = await pool.connect();

  try{

    await client.query("BEGIN");

    const doWorkspaceExist = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId
    })

    if ( !doWorkspaceExist ) {
      throw new Error("Workspace does not exist") ;
    }

    const isWorkspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId,
      workspaceId
    })

    if ( !isWorkspaceMember) {
      throw new Error("You are not a member of that workspace") ;
    }

    if (isWorkspaceMember.role !== "OWNER") {
      throw new Error("You are not authorized to perform that action") ;
    }

    const workspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : memberId,
      workspaceId
    })

    if ( !workspaceMember ) {
      throw new Error("Target member not found") ;
    }

    if ( !validRoles.includes(role) ) {
      throw new Error("Enter a valid role") ;
    }

    if (workspaceMember.role === "OWNER") {
    throw new Error("Workspace owner role cannot be modified");
    }

    if ( workspaceMember.role === role) {
      throw new Error("Member already has that role") ;
    }

    const updatedMemberRole = await workspaceMemberModel.updateMemberRole({
      client,
      workspaceId,
      memberId,
      role
    })

    await client.query("COMMIT");

    return updatedMemberRole



  }catch (error) {

    console.error(error);

    await client.query("ROLLBACK");

    throw error;


  }finally{
    client.release() ;
  }
}


const deleteWorkspaceMember = async ( { workspaceId , userId , memberId } ) => {

  const client = await pool.connect();

  try{

    await client.query("BEGIN");

    const doWorkspaceExist = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId
    })

    if ( !doWorkspaceExist ) {
      throw new Error("Workspace does not exist") ;
    }

    const isWorkspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId,
      workspaceId
    })

    if ( !isWorkspaceMember) {
      throw new Error("You are not a member of that workspace") ;
    }

    if (isWorkspaceMember.role !== "OWNER") {
      throw new Error("You are not authorized to perform that action") ;
    }

    const workspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : memberId,
      workspaceId
    })

    if ( !workspaceMember ) {
      throw new Error("Target member not found") ;
    }

    if (workspaceMember.role === "OWNER") {
    throw new Error("Cannot remove owner");
    }

    const deletedMember = await workspaceMemberModel.deleteWorkspaceMember({
      client,
      workspaceId,
      memberId
    })

    await client.query("COMMIT")

    return deletedMember ;



  }catch (error) {

    console.error(error);

    await client.query("ROLLBACK");

    throw error;


  }finally{
    client.release() ;
  }
}


module.exports = {
    addWorkspaceMember,
    getWorkspaceMembers,
    updateMemberRole,
    deleteWorkspaceMember
}