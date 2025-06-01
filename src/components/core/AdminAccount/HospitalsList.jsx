/* eslint-disable react/jsx-key */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiConnector } from '../../../services/apiConnector';
import { CHANGE_HOSPITAL_STATUS, GET_HOSPITALS_LIST } from '../../../services/apis';
import { useSearchParams } from 'react-router-dom';
import Chip from '../../common/Chip';
import Modal from '../../common/Modal';
import HospitalDetails from '../HospitalAccount/HospitalDetails';
import toast from 'react-hot-toast';

const fetchHospitals = async (page = 1, limit = 10, approvalStatus) => {
  const params = {
    page,
    limit,
  }
  if (approvalStatus) {
    params.approvalStatus = approvalStatus;
  }
  const data = await apiConnector('GET', GET_HOSPITALS_LIST, {}, {}, params)
  return data;
};
export default function AdminHospitalsList() {

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [approvalStatus, setApprovalStatus] = useState('');
  const limit = 10;
  const [applicationModal, setApplicationModal] = useState(false)
  const [applicationData, setApplicationData] = useState(null)

  const { data, isLoading, isError, error, refetch } = useQuery(
    ['hospitals', page, limit, approvalStatus],
    () => fetchHospitals(page, limit, approvalStatus),
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector('POST', CHANGE_HOSPITAL_STATUS + `/${payload?._id}`, {
        action: payload.action
      });
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        setApplicationData(null)
        setApplicationModal(false)
        toast.success('Application updated successfully!');
        refetch();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    },
  });

  if (isLoading) return <div className="text-center mt-4">Loading...</div>;
  if (isError) return <div className="text-center mt-4">Error: {error.message}</div>;

  const renderChip = (hospital) => {
    return (
      <Chip
        text={hospital?.approvalStatus}
        bgColor={
          hospital?.approvalStatus === "Started"
            ? "bg-yellow-400"
            : hospital?.approvalStatus === "Pending"
              ? "bg-orange-400"
              : hospital?.approvalStatus === "Rejected"
                ? "bg-red-400"
                : hospital?.approvalStatus === "Approved"
                  ? "bg-green-400"
                  : "bg-gray-400"
        }
      />
    )
  }

  return (
    <>
      <div className="container mx-auto mt-4 pb-10">
        <h3 className='font-semibold text-2xl mb-6'>Hospitals List</h3>
        <div className="mb-4">
          <label className="mr-2">Filter by Approval Status:</label>
          <select value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)} className="p-2 rounded border-2">
            <option value=''>All</option>
            <option value='Started'>Started</option>
            <option value='Pending'>Pending</option>
            <option value='Rejected'>Rejected</option>
            <option value='Approved'>Approved</option>
          </select>
        </div>
        {data?.data?.hospitals?.length > 0
          ?
          <>
            <p className='mb-4'>
              Total Hospitals: <b>{data?.data?.total || 0}</b>
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {data?.data?.hospitals?.map((hospital) => (
                <div key={hospital?._id} className='border-2 p-4 space-y-2'>
                  <p className="font-semibold block text-sm truncate max-w-[12rem]">
                    {hospital?.additionalFields?.hospitalName}
                  </p>
                  <p className='text-sm truncate break-words break-before-auto'>
                    {hospital?.email}
                  </p>
                  <div className='flex items-center space-x-2'>
                    {renderChip(hospital)}
                    {hospital?.approvalStatus !== 'started' ? <button onClick={() => {
                      setApplicationData(hospital)
                      setApplicationModal(true)
                    }} className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2">
                      {hospital?.approvalStatus === "Pending" ? "View Application" : "View Details"}
                    </button> : null}
                  </div>
                </div>
              ))}
            </div>
          </>
          : <div className="text-center mt-4 font-semibold min-h-[35vh] grid place-content-center">No Hospitals Found</div>
        }
        <div className="flex justify-between items-center mt-4 fixed bg-white right-0 pl-6 border-t-2 py-2 left-0 md:left-[270px] bottom-0">
          <div className='flex space-x-10 items-center'>
            <button className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2" onClick={() => {
              // setPage(prev => Math.max(prev - 1, 1))
              searchParams.set("page", Math.max(page - 1, 1));
              setSearchParams(searchParams);
            }} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {data?.data?.totalPages || 0}</span>
            <button
              onClick={() => {
                // setPage(prev => (!data?.data || !data?.data?.total || prev >= Math.ceil(data?.data?.total / limit) ? prev : prev + 1))
                const nextPage = (!data?.data || !data?.data?.total || page >= Math.ceil(data?.data?.total / limit) ? page : page + 1);
                searchParams.set("page", nextPage);
                setSearchParams(searchParams);
              }}
              disabled={!data?.data || !data?.data?.total || page >= Math.ceil(data?.data?.total / limit)}
              className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={applicationModal}
        setOpen={setApplicationModal}
        title="Hospital Application"
        onClose={() => {
          setApplicationData(null)
        }}
        hideFooter={true}
        btnText={
          mutation?.isLoading
            ? "Loading"
            : applicationData?.approvalStatus === "Pending"
              ? "Approve"
              : applicationData?.approvalStatus === "Rejected"
                ? "Approve"
                : applicationData?.approvalStatus === "Approved"
                  ? "Reject"
                  : "Close"
        }
        submitHandler={() => mutation?.mutate(applicationData)}
        isDisabled={mutation?.isLoading}
      >
        <div className='p-4 space-y-3'>
          <div className='flex items-center flex-wrap space-x-2'>
            {renderChip(applicationData)}
            {applicationData?.approvalStatus === 'Pending' || applicationData?.approvalStatus === 'Rejected' ?
              <button
                onClick={() => mutation?.mutate({
                  _id: applicationData?._id,
                  action: "approve"
                })}
                className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2"
              >
                Approve
              </button> : null}
            {applicationData?.approvalStatus === 'Approved' || applicationData?.approvalStatus === 'Pending' ?
              <button
                onClick={() => mutation?.mutate({
                  _id: applicationData?._id,
                  action: "reject"
                })}
                className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2"
              >
                Reject
              </button>
              : null}
          </div>
          <HospitalDetails user={applicationData} showHeader={false} />
        </div>
      </Modal>
    </>
  )
}