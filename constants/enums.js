// ==================== Enum Constants ====================
// Centralized enums for project, ticket, priority, and file types

// Project status values
export const PROJECT_STATUS = {
  ACTIVE: "active",
  ARCHIVE: "archived",
  DEACTIVE: "deactive",
};

// Ticket status values
export const STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

// Ticket type values
export const TICKET_TYPE = {
  FEATURE: "feature",
  BUG: "Bug",
};

// Ticket priority values
export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

// File type values for attachments
export const FILE_TYPE = {
  FILE: "file",
  LINK: "link",
  NULL: null,
};
