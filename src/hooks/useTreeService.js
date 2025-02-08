import { useQuery } from "@tanstack/react-query";
import TreeService from "../services/treeService";

export const useTreeData = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ["trees", page, filters],
    queryFn: () => TreeService.fetchTrees(page, filters),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

export const useTreeDetails = (treeId) => {
  return useQuery({
    queryKey: ["tree", treeId],
    queryFn: () => TreeService.fetchTreeDetails(treeId),
    enabled: !!treeId, // Only fetch when treeId is available
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}; 