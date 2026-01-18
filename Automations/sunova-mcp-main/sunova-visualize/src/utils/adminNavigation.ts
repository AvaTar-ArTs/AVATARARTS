/**
 * Admin navigation utility functions
 * Provides helpers for generating consistent admin route URLs
 */

export const adminRoutes = {
  apiLogs: "/admin/api-logs",
  tasks: "/admin/tasks",
  transactions: "/admin/transactions",
  users: "/admin/users",
  userDetail: (userId: string) => `/admin/users/${userId}`,
  betaApplications: "/admin/beta-applications",
} as const;

export const getUserDetailUrl = (userId: string): string => {
  return `/admin/users/${userId}`;
};

export const getTasksFilteredByProject = (projectId: string): string => {
  return `/admin/tasks?project=${projectId}`;
};

export const getProjectStoryboardUrl = (projectId: string): string => {
  return `/project/${projectId}/storyboard`;
};
