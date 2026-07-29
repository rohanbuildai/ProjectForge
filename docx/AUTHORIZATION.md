# Role-Based Access Control (RBAC)

## Roles

- Owner
- Admin
- Member

---

| Action | Owner | Admin | Member | Status |
|----------|:-----:|:-----:|:------:|--------|
| Create Workspace | ✅ | ❌ | ❌ | Implemented |
| Delete Workspace | ✅ | ❌ | ❌ | Implemented |
| Update Workspace | ✅ | ✅ | ❌ | Implemented |
| Invite Members | ✅ | ✅ | ❌ | Upcoming |
| Remove Members | ✅ | ✅ | ❌ | Implemented |
| Change Roles | ✅ | ❌ | ❌ | Implemented |
| Transfer Ownership | ✅ | ❌ | ❌ | Upcoming |
| Create Project | ✅ | ✅ | ✅ | Implemented |
| Delete Project | ✅ | ✅ | ❌ | Implemented |
| Create Task | ✅ | ✅ | ✅ | Implemented |
| Delete Task | ✅ | ✅ | Task Owner | Implemented |

---

## Principle

Authentication verifies **who the user is**.

Authorization determines **what the user can do**.