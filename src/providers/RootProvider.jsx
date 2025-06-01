import { useEffect, useMemo, useRef, useState } from "react";
import RouterProviderMain from "./RouterProviderMain.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiConnector, axiosInstance } from "../services/apiConnector.js";
import { Toaster } from "react-hot-toast";
import { useUser } from "../store/useUser.js";
import { GET_USER_DETAILS } from "../services/apis.js";

// Create a client
const queryClient = new QueryClient();

export default function RootProvider() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const initialized = useRef(false);
  const { user, setUser, isAuth, setIsAuth, accountType, setAccountType, approvalStatus, setApprovalStatus } = useUser()

  useEffect(()=>{
    if(!initialized.current){
      initialized.current = true;
      if(isAuth && accountType && approvalStatus && !user) {
        (async()=>{
          try {
            const data = await apiConnector('GET', GET_USER_DETAILS)
            if(!data?.data?.data?.user) {
              setIsAuth(false)
              setAccountType(null)
              setApprovalStatus(null)
              setSessionExpired(true)
            }
            setUser(data?.data?.data?.user)
            setAccountType(data?.data?.data?.user?.accountType)
            setApprovalStatus(data?.data?.data?.user?.approvalStatus)
          } catch(error) {
            setIsAuth(false)
            setAccountType(null)
            setApprovalStatus(null)
            setSessionExpired(true)
          }
        })()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useMemo(() => {
    // Add a response interceptor to catch session expiry
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status === 401) {
          // Do something here
          setSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );
  }, [setSessionExpired]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {!sessionExpired ? (
          <RouterProviderMain />
        ) : (
          <div className="grid place-content-center min-h-screen">
            <h1 className="text-2xl text-center font-semibold mb-4">Session Expired</h1>
            <button onClick={() => location.reload()} className="bg-blue-500 text-white rounded-md px-4 py-2">
              Login
            </button>
          </div>
        )}
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
