const workspaceMemberModel = require("../models/workspaceMember.model");
const userModel = require("../models/user.model");
const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const notificationService = require("../services/notifications.service");
const activityLogsService = require("../services/activityLogs.service");
const workspaceInvitationModel = require("../models/workspaceInvitation.model");




const addWorkspaceMember = async ({ userId, workspaceId, email, role }) => {
  const client = await pool.connect();

  try {

    const memberRole = await workspaceMemberModel.getMemberRole({
      client,
      workspaceId,
      userId,
    });

    if ( !memberRole) {
      const error = new Error("You are not a member of workspace");
      error.statusCode = 403;
      throw error;
    }

    if ( memberRole.role === "MEMBER" ) {
      const error = new Error("You don't have the permission to add members");
      error.statusCode = 403;
      throw error;
    }

    const user = await userModel.getUserByEmail({
      client,
      email,
    })

    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 404;
      throw error;
    }

    const existingMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : user.id,
      workspaceId
    })

    if ( existingMember ) {
      const error = new Error("User already exists as a member");
      error.statusCode = 409;
      throw error;
    }

    if ( role == "OWNER") {
      const error = new Error("Two owners cannot exist in one workspace");
      error.statusCode = 400;
      throw error;
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

    /* Activity log */
    try {
      await activityLogsService.createActivityLog({
        workspaceId,
        userId,
        action: "member_added",
        entityType: "workspace_member",
        entityId: user.id,
        metadata: { memberName: user.name, memberEmail: email, role },
      });
    } catch (logErr) {
      console.warn("Activity log failed (member_added):", logErr.message);
    }

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


/* ------------------------------------------------------------------ */
/* Enhanced members list with search, filter, sort, pagination,       */
/* statistics, and pending invitation count — single endpoint.        */
/* ------------------------------------------------------------------ */

const VALID_ROLES = ["OWNER", "ADMIN", "MEMBER"];
const VALID_SORT_KEYS = ["name", "joined", "role", "projects", "tasks"];
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getWorkspaceMembersDetailed = async ({
  userId,
  workspaceId,
  search,
  role,
  status,
  sortBy,
  order,
  page,
  limit,
}) => {
  const client = await pool.connect();

  try {
    /* Verify the requesting user belongs to this workspace */
    const userWorkspace = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId,
    });

    if (!userWorkspace) {
      const error = new Error("You are not a member of that workspace");
      error.statusCode = 403;
      throw error;
    }

    /* Sanitize & default params */
    const safeRole = role && VALID_ROLES.includes(role.toUpperCase())
      ? role.toUpperCase()
      : null;
    const safeSortBy = VALID_SORT_KEYS.includes(sortBy) ? sortBy : "name";
    const safeOrder = order === "desc" ? "desc" : "asc";
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    let safeLimit = parseInt(limit, 10) || DEFAULT_LIMIT;
    if (safeLimit < 1) safeLimit = DEFAULT_LIMIT;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;
    const safeSearch = search ? search.trim() : null;

    /* Fetch members with pagination */
    const membersResult = await workspaceMemberModel.getWorkspaceMembersDetailed({
      client,
      workspaceId,
      search: safeSearch,
      role: safeRole,
      sortBy: safeSortBy,
      order: safeOrder,
      page: safePage,
      limit: safeLimit,
    });

    /* Normalize member data — add status field */
    const members = membersResult.members.map((m) => ({
      ...m,
      status: "active",
      projects: m.project_count,
      tasks: m.task_count,
      joined: m.joined_at,
    }));

    /* Fetch aggregate statistics (always unfiltered, workspace-wide) */
    const stats = await workspaceMemberModel.getMemberStatistics({
      client,
      workspaceId,
    });

    /* Pending invitations count */
    let pendingCount = 0;
    try {
      const invitations = await workspaceInvitationModel.getWorkspaceInvitations({
        client,
        workspaceId,
      });
      pendingCount = invitations.length;

      /* If status filter = "pending", return invitations as rows instead */
      if (status === "pending") {
        const pendingMembers = invitations.map((inv) => ({
          id: `inv-${inv.id}`,
          name: null,
          email: inv.email,
          role: inv.role,
          status: "pending",
          joined: inv.created_at,
          joined_at: inv.created_at,
          projects: 0,
          tasks: 0,
          project_count: 0,
          task_count: 0,
          invitation_id: inv.id,
        }));

        return {
          members: pendingMembers,
          pagination: {
            total: pendingMembers.length,
            page: 1,
            limit: safeLimit,
            totalPages: Math.ceil(pendingMembers.length / safeLimit) || 1,
          },
          statistics: {
            total: stats.total_members,
            active: stats.active_members,
            owners: stats.owners,
            pending: pendingCount,
          },
          currentUserRole: userWorkspace.role,
        };
      }
    } catch (invErr) {
      console.warn("Failed to load invitations count:", invErr.message);
    }

    return {
      members,
      pagination: {
        total: membersResult.total,
        page: membersResult.page,
        limit: membersResult.limit,
        totalPages: membersResult.totalPages,
      },
      statistics: {
        total: stats.total_members,
        active: stats.active_members,
        owners: stats.owners,
        pending: pendingCount,
      },
      currentUserRole: userWorkspace.role,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};


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
      const error = new Error("Workspace does not exist");
      error.statusCode = 404;
      throw error;
    }

    const isWorkspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId,
      workspaceId
    })

    if ( !isWorkspaceMember) {
      const error = new Error("You are not a member of that workspace");
      error.statusCode = 403;
      throw error;
    }

    if (isWorkspaceMember.role !== "OWNER") {
      const error = new Error("You are not authorized to perform that action");
      error.statusCode = 403;
      throw error;
    }

    const workspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : memberId,
      workspaceId
    })

    if ( !workspaceMember ) {
      const error = new Error("Target member not found");
      error.statusCode = 404;
      throw error;
    }

    if ( !validRoles.includes(role) ) {
      const error = new Error("Enter a valid role");
      error.statusCode = 400;
      throw error;
    }

    if (workspaceMember.role === "OWNER") {
      const error = new Error("Workspace owner role cannot be modified");
      error.statusCode = 403;
      throw error;
    }

    if ( workspaceMember.role === role) {
      const error = new Error("Member already has that role");
      error.statusCode = 409;
      throw error;
    }

    const updatedMemberRole = await workspaceMemberModel.updateMemberRole({
      client,
      workspaceId,
      memberId,
      role
    })

    await client.query("COMMIT");

    /* Activity log */
    try {
      const targetUser = await userModel.getUserById({ client, userId: memberId });
      await activityLogsService.createActivityLog({
        workspaceId,
        userId,
        action: "member_role_changed",
        entityType: "workspace_member",
        entityId: memberId,
        metadata: {
          memberName: targetUser?.name,
          previousRole: workspaceMember.role,
          newRole: role,
        },
      });
    } catch (logErr) {
      console.warn("Activity log failed (role_changed):", logErr.message);
    }

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
      const error = new Error("Workspace does not exist");
      error.statusCode = 404;
      throw error;
    }

    const isWorkspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId,
      workspaceId
    })

    if ( !isWorkspaceMember) {
      const error = new Error("You are not a member of that workspace");
      error.statusCode = 403;
      throw error;
    }

    if (isWorkspaceMember.role !== "OWNER") {
      const error = new Error("You are not authorized to perform that action");
      error.statusCode = 403;
      throw error;
    }

    const workspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : memberId,
      workspaceId
    })

    if ( !workspaceMember ) {
      const error = new Error("Target member not found");
      error.statusCode = 404;
      throw error;
    }

    if (workspaceMember.role === "OWNER") {
      const error = new Error("Cannot remove owner");
      error.statusCode = 403;
      throw error;
    }

    /* Capture target user info before deletion for the activity log */
    const targetUser = await userModel.getUserById({ client, userId: memberId });

    const deletedMember = await workspaceMemberModel.deleteWorkspaceMember({
      client,
      workspaceId,
      memberId
    })

    await client.query("COMMIT")

    /* Activity log */
    try {
      await activityLogsService.createActivityLog({
        workspaceId,
        userId,
        action: "member_removed",
        entityType: "workspace_member",
        entityId: memberId,
        metadata: {
          memberName: targetUser?.name,
          memberEmail: targetUser?.email,
        },
      });
    } catch (logErr) {
      console.warn("Activity log failed (member_removed):", logErr.message);
    }

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
    getWorkspaceMembersDetailed,
    updateMemberRole,
    deleteWorkspaceMember
}