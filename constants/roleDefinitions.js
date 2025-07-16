// ==================== Role Definitions ====================
// Centralized permissions for each role

export const ROLE_PERMISSIONS = {
  // Admin: full permissions
  admin: {
    canManageUsers: true,
    canDeleteAnything: true,
    canCreateProjects: true,
  },
  // Manager: can create projects
  manager: {
    canManageUsers: false,
    canDeleteAnything: false,
    canCreateProjects: true,
  },
  // Developer: limited permissions
  developer: {
    canManageUsers: false,
    canDeleteAnything: false,
    canCreateProjects: false,
  },
};
