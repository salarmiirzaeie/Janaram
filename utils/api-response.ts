/** Thrown from RTK transformResponse — surfaces as `error.data.message` on `.unwrap()` */
export function apiResponseError(message: string) {
  return {
    status: 400,
    data: { message },
  };
}

export function unwrapApiData<T>(
  response: { success?: boolean; message?: string; data?: T },
  fallbackMessage = "خطای سرور"
): T {
  if (response?.success === false || response?.data === undefined) {
    throw apiResponseError(response?.message || fallbackMessage);
  }
  return response.data;
}

export function unwrapApiSuccess(
  response: { success?: boolean; message?: string },
  fallbackMessage = "خطای سرور"
): { success: boolean; message: string } {
  if (response?.success === false) {
    throw apiResponseError(response?.message || fallbackMessage);
  }
  return {
    success: true,
    message: response.message || "عملیات موفق",
  };
}
