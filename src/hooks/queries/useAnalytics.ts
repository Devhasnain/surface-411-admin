import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_ANALYTICS,
    queryFn: () => analyticsService.dashboardAnalytics()
  });
};
