// ROLE DEFINITIONS
export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canDeleteAnything: true,
    canCreateProjects: true,
  },
  manager: {
    canManageUsers: false,
    canDeleteAnything: false,
    canCreateProjects: true,
  },
  developer: {
    canManageUsers: false,
    canDeleteAnything: false,
    canCreateProjects: false,
  },
};
