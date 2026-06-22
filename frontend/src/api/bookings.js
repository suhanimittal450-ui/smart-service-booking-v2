import api from "./axios";

export const createBooking = (payload) => api.post("/bookings", payload);
export const getMyBookings = () => api.get("/bookings/my-bookings");
export const getProviderBookings = () => api.get("/bookings/provider-bookings");
export const getAllBookings = () => api.get("/bookings/admin/all");
export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { status });
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
// Payment APIs
export const createPaymentOrder = (bookingId) =>
  api.post("/payments/create-order", { bookingId });

export const verifyPayment = (payload) => api.post("/payments/verify", payload);
