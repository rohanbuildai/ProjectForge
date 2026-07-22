# REST API

## Authentication

POST /register

POST /login

POST /refresh-token

POST /logout

GET /me

---

## Workspaces

POST /workspaces

GET /workspaces

GET /workspaces/:id

PATCH /workspaces/:id

DELETE /workspaces/:id

---

## Members

GET /workspaces/:id/members

PATCH /members/:id/role

DELETE /members/:id

---

## Invitations

POST /workspaces/:id/invitations

GET /invitations/:token

POST /invitations/:token/accept

POST /invitations/:token/reject

---

## Projects

POST /projects

GET /projects

PATCH /projects/:id

DELETE /projects/:id

---

## Tasks

POST /tasks

GET /tasks

PATCH /tasks/:id

DELETE /tasks/:id

---

## Response Format

{
    "success": true,
    "message": "",
    "data": {}
}

---

## HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error