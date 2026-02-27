import type { BestPractice } from "./bestPractices";
import type { DTMPDepartment } from "../departments";

const normalized = (value: string) => value.trim().toLowerCase();

export const mapIndustryToDepartment = (industry: string): DTMPDepartment => {
  const value = normalized(industry);
  if (value.includes("financial")) return "Finance";
  if (value.includes("healthcare")) return "Operations";
  if (value.includes("retail")) return "Marketing";
  if (value.includes("manufacturing")) return "Operations";
  if (value.includes("public sector")) return "Strategy";
  if (value.includes("technology")) return "Engineering";
  if (value.includes("education")) return "HR";
  if (value.includes("energy")) return "Operations";
  return "Leadership";
};

export const mapBestPracticeToDepartment = (
  item: Pick<BestPractice, "domain">
): DTMPDepartment => {
  const value = normalized(item.domain);
  if (value.includes("architecture")) return "Architecture";
  if (value.includes("platform operations")) return "Operations";
  if (value.includes("data")) return "Engineering";
  if (value.includes("security")) return "Engineering";
  if (value.includes("customer experience")) return "Marketing";
  if (value.includes("digital workplace")) return "HR";
  if (value.includes("governance")) return "Leadership";
  return "Strategy";
};
