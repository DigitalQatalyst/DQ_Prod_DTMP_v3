export const dtmpDepartments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Operations",
  "HR",
  "Finance",
  "Executive",
  "Architecture",
  "Leadership",
  "Strategy",
] as const;

export type DTMPDepartment = (typeof dtmpDepartments)[number];
