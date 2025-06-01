const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth APIs
export const SEND_OTP = `${BASE_URL}/auth/send-otp`;
export const SIGNUP = `${BASE_URL}/auth/signup`;
export const LOGIN = `${BASE_URL}/auth/login`;
export const FORGOT_PASSWORD = `${BASE_URL}/auth/forgot-password`;
export const LOGOUT = `${BASE_URL}/auth/logout`;
export const VERIFY_CERTIFICATE = `${BASE_URL}/auth/verify`;

// User APIs
export const GET_USER_DETAILS = `${BASE_URL}/user/user-details`;
export const GET_USER_PROFILE_DETAILS = `${BASE_URL}/user/user-profile-details`;
export const CREATE_USER_DETAILS = `${BASE_URL}/user/create-user-details`;
export const LIST_CERTIFICATES = `${BASE_URL}/user/list-certificates`;

// Hospital APIs
export const CREATE_HOSPITAL_DETAILS = `${BASE_URL}/hospital/create-hospital-details`;
export const GET_HOSPITAL_REVIEWS = `${BASE_URL}/hospital/get-hospital-reviews`;

// Admin APIs
export const GET_HOSPITALS_LIST = `${BASE_URL}/admin/get-hospitals-list`;
export const POPULATE_USER = `${BASE_URL}/admin/populate-user`;
export const CHANGE_HOSPITAL_STATUS = `${BASE_URL}/admin/change-hospital-status`;
export const GET_ADMIN_STATS = `${BASE_URL}/admin/get-stats`;

// Post APIs
export const CREATE_POST = `${BASE_URL}/posts/create-post`;
export const GET_POSTS = `${BASE_URL}/posts/get-posts`;
export const GET_POST_DETAILS = `${BASE_URL}/posts/get-post-details`;

// Find APIs
export const FIND_DONORS = `${BASE_URL}/find/donors`;
export const FIND_HOSPITALS = `${BASE_URL}/find/hospitals`;

// Request APIs
export const CREATE_REQUEST = `${BASE_URL}/request/create`;
export const LIST_REQUESTS = `${BASE_URL}/request/list`;
export const UPDATE_REQUEST_STATUS = `${BASE_URL}/request/update`;

// Registration APIs
export const CREATE_REGISTRATION = `${BASE_URL}/register/create`;
export const LIST_USER_REGISTRATIONS = `${BASE_URL}/register/list-users`;
export const LIST_HOSPITAL_REGISTRATIONS = `${BASE_URL}/register/list-hospitals`;
export const UPDATE_REGISTRATION_STATUS = `${BASE_URL}/register/update`;