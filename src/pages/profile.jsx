/* eslint-disable react-hooks/exhaustive-deps */
import useCustomTitle from "../hooks/useCustomTitle";
import { useUser } from "../store/useUser";
import UserApprovedView from "../components/core/UserAccount/ApprovedView";
import UserUnApprovedView from "../components/core/UserAccount/UnApprovedView";
import HospitalUnApprovedView from "../components/core/HospitalAccount/UnApprovedView";
import HospitalApprovalPendingView from "../components/core/HospitalAccount/ApprovalPendingView";
import HospitalRejectedView from "../components/core/HospitalAccount/RejectedView";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  useCustomTitle("Profile | Blood Donation");

  const userview = useMemo(() => {
    const accountType = user?.accountType;
    const approvalStatus = user?.approvalStatus;

    if (accountType === 'User') {
      if (approvalStatus !== 'Approved') {
        return <UserUnApprovedView />
      }
    } else if (accountType === 'Hospital') {
      if (approvalStatus === 'Started') {
        return <HospitalUnApprovedView />
      } else if (approvalStatus === 'Pending') {
        return <HospitalApprovalPendingView />
      } else if (approvalStatus === 'Rejected') {
        return <HospitalRejectedView />
      } else {
        return null
      }
    } else {
      return null
    }
  }, [user?.approvalStatus, user?.accountType])

  return (
    <>
      <div className={user?.approvalStatus !== 'Approved' ? 'w-11/12 max-w-[1200px] mx-auto' : ''}>
        {user?.approvalStatus !== 'Approved' ? <>
          {userview}
        </> : (
          <UserApprovedView>
            <Outlet />
          </UserApprovedView>
        )}
      </div>
    </>
  );
}
