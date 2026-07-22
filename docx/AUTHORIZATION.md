# Role-Based Access Control (RBAC)

## Roles

- Owner
- Admin
- Member

---

| Action | Owner | Admin | Member |
|----------|:-----:|:-----:|:------:|
| Create Workspace | ✅ | ❌ | ❌ |
| Delete Workspace | ✅ | ❌ | ❌ |
| Update Workspace | ✅ | ✅ | ❌ |
| Invite Members | ✅ | ✅ | ❌ |
| Remove Members | ✅ | ✅ | ❌ |
| Change Roles | ✅ | ❌ | ❌ |
| Transfer Ownership | ✅ | ❌ | ❌ |
| Create Project | ✅ | ✅ | ✅ |
| Delete Project | ✅ | ✅ | ❌ |
| Create Task | ✅ | ✅ | ✅ |
| Delete Task | ✅ | ✅ | Task Owner |

---

## Principle

Authentication verifies **who the user is**.

Authorization determines **what the user can do**.