import { useMutation, useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import {
    LIST_HOSPITAL_REGISTRATIONS,
    LIST_USER_REGISTRATIONS,
    UPDATE_REGISTRATION_STATUS,
} from "../../../services/apis";
import { useUser } from "../../../store/useUser";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import Chip from "../../common/Chip";

const fetchRegistrations = async (type) => {
    const url =
        type === "Hospital" ? LIST_HOSPITAL_REGISTRATIONS : LIST_USER_REGISTRATIONS;
    const data = await apiConnector("GET", url);
    return data;
};

export default function Registrations() {
    const { user } = useUser();
    const { data, isLoading, isError, error } = useQuery(
        ["registrations", user?.accountType],
        () => fetchRegistrations(user?.accountType),
        {
            keepPreviousData: true,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
        }
    );
    const [searchId, setSearchId] = useState("");

    const changeMutation = useMutation({
        mutationFn: (id) => {
            return apiConnector('POST', UPDATE_REGISTRATION_STATUS + `/${id}`);
        },
        onSuccess: async (data) => {
            if (data?.data?.success) {
                toast.success('Status Updated Successfully');
                // fake wait for 1.5sec
                await new Promise((resolve) => setTimeout(resolve, 1500));
                window.location.reload();
            }
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Something went wrong!');
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message || "Something Went Wrong!"}</div>;
    }

    const renderUserList = () => {
        return (
            <>
                {data?.data?.data?.length > 0 ? (
                    data?.data?.data?.map((registration) => (
                        <div key={registration._id} className="bg-gray-50 border p-3">
                            <div className="flex items-center gap-x-2 mb-2">
                                <div>
                                    <Link to={`/hospital/${registration?.hospital?._id}`}>
                                        <img
                                            src={registration?.hospital?.profilePic}
                                            alt={registration?.hospital?.additionalFields?.hospitalName}
                                            className="rounded-full h-10 w-10"
                                        />
                                    </Link>
                                </div>
                                <Link
                                    className="font-semibold block text-sm truncate max-w-[12rem]"
                                    to={`/hospital/${registration?.hospital?._id}`}
                                >
                                    {registration?.hospital?.additionalFields?.hospitalName}
                                </Link>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold text-gray-800">Registration ID:</span>{" "}
                                    {registration?._id}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold text-gray-800">City:</span>{" "}
                                    {registration?.hospital?.additionalFields?.city}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold text-gray-800">
                                        Date and Time:
                                    </span>{" "}
                                    {new Date(registration?.post.timing).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}{" "}
                                    {new Date(registration?.post.timing).toLocaleTimeString(
                                        "en-US",
                                        {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        }
                                    )}
                                </p>
                            </div>
                            <Link to={`/post/${registration?.post?._id}`}
                                className="text-blue-500 font-semibold underline"
                            >Go to Post</Link>
                            <Chip
                                text={registration?.status}
                                bgColor={
                                    registration?.status === "Fulfilled"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                                }
                            />
                        </div>
                    ))
                ) : (
                    <div className="min-h-[10vh] py-10 text-center font-semibold">
                        No Registrations Found
                    </div>
                )}
            </>
        )
    }

    const renerHospitalList = () => {

        const filteredData = searchId ? data?.data?.data?.filter((registration) => registration._id.includes(searchId)) : data?.data?.data;

        return (
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="🔍 Search by Registration ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 w-full"
                />
                {filteredData?.length > 0 ? (filteredData.map((registration) => (
                    <div key={registration._id} className="bg-gray-50 border p-3">
                        <div className="flex items-center gap-x-2 mb-2">
                            <div>
                                <Link to={`/user/${registration?.user?._id}`}>
                                    <img
                                        src={registration?.user?.profilePic}
                                        alt={registration?.user?.name}
                                        className="rounded-full h-10 w-10"
                                    />
                                </Link>
                            </div>
                            <Link
                                className="font-semibold block text-sm truncate max-w-[12rem]"
                                to={`/user/${registration?.user?._id}`}
                            >
                                {registration?.user?.name}
                            </Link>
                        </div>
                        <div>
                            <p>
                                <span className="font-semibold text-gray-800">Registration ID:</span>{" "}
                                {registration?._id}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-semibold text-gray-800">City:</span>{" "}
                                {registration?.user?.additionalFields?.city}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-semibold text-gray-800">
                                    Age:
                                </span>{" "}
                                {registration?.user?.additionalFields?.age}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-semibold text-gray-800">
                                    Gender:
                                </span>{" "}
                                {registration?.user?.additionalFields?.gender}
                            </p>
                        </div>
                        <Link to={`/post/${registration?.post?._id}`}
                            className="text-blue-500 font-semibold block underline"
                        >Go to Post</Link>
                        {registration?.status === 'Fulfilled' ? (
                            <Chip
                                text="Fulfilled"
                                bgColor="bg-green-500"
                            />
                        ) : null}
                        {registration?.status === 'Registered' ? (
                            <button
                                disabled={changeMutation.isLoading}
                                className="p-2 bg-blue-500 text-white rounded"
                                onClick={() => changeMutation.mutate(registration._id)}
                            >
                                Fulfill
                            </button>
                        ) : null}
                    </div>
                ))
                ) : (
                    <div className="min-h-[10vh] py-10 text-center font-semibold">
                        No Registrations Found
                    </div>
                )}
            </div>
        )
    }

    return (
        <>
            <h4 className="text-xl font-semibold my-4 md:ml-4">Your Registrations</h4>
            <div className="space-y-4 sm:pl-4 pb-20">
                {user?.accountType === 'User' ? renderUserList() : null}
                {user?.accountType === 'Hospital' ? renerHospitalList() : null}
            </div>
        </>
    );
}
