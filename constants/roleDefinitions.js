// ==================== Role Definitions ====================
// Centralized permissions for each role

export const ROLE_PERMISSIONS = {
  // Admin: full permissions
  admin: {
    canManageUsers: true,
    canDeleteAnything: true,
    canManageProjects: true,
    canManageWorkspaces: true,
    canManageTickets: true,
    canAssignRoles: true,
  },
  // Manager: can create projects
  manager: {
    canManageUsers: false,
    canDeleteAnything: false,
    canManageProjects: true,
    canManageWorkspaces: false,
    canManageTickets: true,
    canAssignRoles: false,
  },
  // Developer: limited permissions
  developer: {
    canManageUsers: false,
    canDeleteAnything: false,
    canManageProjects: false,
    canManageWorkspaces: false,
    canManageTickets: true,
    canAssignRoles: false,
  },
};
