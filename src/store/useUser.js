import { create } from "zustand";

const getLocalUser = () => {
  const isLoggedInLocal = localStorage.getItem("auth");
  if (!isLoggedInLocal) return false;
  const isLoggedIn = JSON.parse(localStorage.getItem("auth"));
  if (typeof isLoggedIn === "boolean") return isLoggedIn;
  return false;
};

const getLocalAccountType = () => {
  const localAccountType = localStorage.getItem("accountType");
  if (!localAccountType) return null;
  const accountType = JSON.parse(localAccountType);
  if (typeof accountType !== "string") return null;
  if(accountType !== 'Admin' && accountType !== 'User' && accountType !== 'Hospital') return null;
  return accountType;
}

const getLocalApprovalStatus = () => {
  const localApprovalStatus = localStorage.getItem("approvalStatus");
  if (!localApprovalStatus) return null;
  const approvalStatus = JSON.parse(localApprovalStatus);
  if (typeof approvalStatus !== "string") return null;
  if(approvalStatus!=='Started' && approvalStatus !== 'Approved' && approvalStatus !== 'Pending' && approvalStatus !== 'Rejected') return null;
  return approvalStatus;

}

const setLocalData = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};

export const useUser = create((set) => ({
  otpType: null, // store either signup or forgot-password
  payload: null, // store either signup data or forgot password data
  user: null, // store user data
  isAuth: getLocalUser(), // store auth status
  accountType: getLocalAccountType(), // store account type
  approvalStatus: getLocalApprovalStatus(), // store approval status
  setOtpType: (data) => set({ otpType: data }),
  setPayload: (data) => set({ payload: data }),
  setUser: (data) => set({ user: data }),
  setIsAuth: (data) => {
    setLocalData('auth', data);
    set({ isAuth: data });
  },
  setAccountType: (data) => {
    setLocalData('accountType', data);
    set({ accountType: data });
  },
  setApprovalStatus: (data) => {
    setLocalData('approvalStatus', data);
    set({ approvalStatus: data });
  },
}));
