export function formatQueryResults(successResponse: any, errorResponse: any) {
  return {
    success: successResponse?.success || errorResponse?.success || false,
    code: successResponse?.code || errorResponse?.code || 500,
    data: successResponse?.data || null,
    message: errorResponse?.message || null
  };
}
