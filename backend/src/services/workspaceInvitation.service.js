const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const workspaceInvitationModel = require("../models/workspaceInvitation.model");
const crypto = require("crypto");


const createWorkspaceInvitation = async ( {  
    userId,
    workspaceId,
    email,
    role,
}) => {

    const client = await pool.connect() ;

    try {

        await client.query('BEGIN') ;

        const workspace = await workspaceModel.getWorkspaceById({
            client,
            workspaceId,
            userId
        })

        if ( !workspace ) {
            throw new Error("Workspace does not exist") ;
        }

        const memberRole = await workspaceMemberModel.getMemberRole({
            client,
            workspaceId,
            userId
        })

        if ( !memberRole || memberRole.role !== "OWNER" ) {

            throw new Error( "You are not allowed to invite members" ) ;
        }

        const normalizedEmail = email.trim().toLowerCase() ;

        const member = await workspaceInvitationModel.getWorkspaceMemberByEmail({
            client,
            workspaceId,
            email : normalizedEmail
        })

        if ( member ) {

            throw new Error("The invited user is already a member")
        }

        const pendingInvitation = await workspaceInvitationModel.getPendingInvitation({
            client,
            workspaceId,
            email : normalizedEmail
        })

        if ( pendingInvitation ) {
            throw new Error("An invite is already pending for this user") ;
        }

        const invitationToken = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto.createHash("sha256")
                                 .update(invitationToken)
                                 .digest("hex");
        const expiresAt = new Date();
        expiresAt.setDate( expiresAt.getDate() + 7 ) ;

        const allowedRoles = ["ADMIN", "MEMBER"];


        if (!allowedRoles.includes(role)) {
            throw new Error("Invalid workspace role");
        }

        const invitation = await workspaceInvitationModel.createInvitation({
        client,
        workspaceId,
        email: normalizedEmail,
        role,
        tokenHash,
        expiresAt,
        invitedBy: userId
    });

        await client.query("COMMIT") ;

        return {
            invitation,
            invitationToken
        }


    }catch(error) {

        await client.query("ROLLBACK") ;

        throw error ;


    }finally {

        client.release() ;
    }
}

module.exports = {
    createWorkspaceInvitation
}