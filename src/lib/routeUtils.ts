import { ROUTES } from "@/constants/routes";

// Helper to construct full paths
export const getFullPath = (path: string) => {
  if (path.startsWith("/")) return path;
  return `${ROUTES.APP.ROOT}/${path}`;
};
