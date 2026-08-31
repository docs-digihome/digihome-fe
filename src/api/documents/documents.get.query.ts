import { queryOptions } from "@tanstack/react-query"
import { getSeededDocuments } from "./documents.get.api"

export const seededDocumentsQueryOptions = () =>
  queryOptions({
    queryKey: ["documents", "seeded"],
    queryFn: () => getSeededDocuments(),
  })
