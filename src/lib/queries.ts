import { queryOptions } from "@tanstack/react-query";
import { getPublicProperties, getDashboard } from "./marketplace.functions";
export const publicOptions = queryOptions({
  queryKey: ["public-properties"],
  queryFn: () => getPublicProperties(),
  staleTime: 60000,
});
export const dashboardOptions = queryOptions({
  queryKey: ["dashboard"],
  queryFn: () => getDashboard(),
  staleTime: 30000,
});
