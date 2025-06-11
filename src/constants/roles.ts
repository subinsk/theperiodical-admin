export const ROLE_LEVELS = {
  super_admin: 4,
  org_admin: 3,
  manager: 2,
  content_writer: 1,
} as const;

export const ROLES_MAP = {
  content_writer: {
    label: "Content Writer",
    value: "content_writer",
    level: ROLE_LEVELS.content_writer,
  },
  manager: {
    label: "Manager",
    value: "manager",
    level: ROLE_LEVELS.manager,
  },
  org_admin: {
    label: "Org Admin",
    value: "org_admin",
    level: ROLE_LEVELS.org_admin,
  },
  super_admin: {
    label: "Super Admin",
    value: "super_admin",
    level: ROLE_LEVELS.super_admin,
  },
};

export type Role = keyof typeof ROLES_MAP;

/**
 * Check if a user has permission to perform actions on a target role
 * @param userRole - The role of the user performing the action
 * @param targetRole - The role being targeted
 * @returns boolean - Whether the user has permission
 */
export const hasRolePermission = (userRole: Role, targetRole: Role): boolean => {
  const userLevel = ROLE_LEVELS[userRole];
  const targetLevel = ROLE_LEVELS[targetRole];
  return userLevel >= targetLevel;
};

/**
 * Get available roles that can be assigned based on the current user's role
 * @param currentRole - The role of the user doing the assignment
 * @param isSuperAdmin - Whether the user is a super admin
 * @returns Array of role keys that can be assigned
 */
export const getAvailableRoles = (currentRole?: Role | null, isSuperAdmin?: boolean): Role[] => {
  if (isSuperAdmin) {
    return Object.keys(ROLES_MAP) as Role[];
  }

  if (!currentRole) return [];

  const userLevel = ROLES_MAP[currentRole].level;
  
  // Filter roles that have a level less than or equal to the user's level
  return (Object.entries(ROLES_MAP) as [Role, typeof ROLES_MAP[Role]][])
    .filter(([_, roleInfo]) => {
      // Users can assign their own role level and below
      return roleInfo.level <= userLevel;
    })
    .map(([role]) => role);
};