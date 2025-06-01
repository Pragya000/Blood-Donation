import Chip from "../../common/Chip";

/* eslint-disable react/prop-types */
export default function RequestCard({ request, currentUser, changeMutation, handleFulfill, handleUserModalOpen }) {
    const requestType = request.requestType;
    const isRequester = request.requester._id === currentUser._id;
    const isRequestee = request.requestee._id === currentUser._id;
    const otherUser = isRequester ? request.requestee : request.requester;
    const otherUserName = otherUser.accountType === 'Hospital' ? otherUser.additionalFields.hospitalName : otherUser.name;
    let showControl = false
    let status
    if (requestType === 'Post') {
        showControl = isRequestee && (request.status === 'Requested' || request.status === 'Accepted');
        if(isRequestee) {
            status = 'Recipient'
        } else {
            status = 'Donor'
        }
    } else {
        if (request.status === 'Requested') {
            showControl = isRequestee;
        } else if (request.status === 'Accepted') {
            showControl = isRequester;
        }
        if(isRequestee) {
            status = 'Donor'
        } else {
            status = 'Recipient'
        }
    }

    return (
        <div className="border p-4 mb-4 rounded shadow">
            <h5 className="text-lg font-bold mb-3">
                {isRequestee ? `${otherUserName} Requested You` : `You Requested ${otherUserName}`}
            </h5>
            <div className="space-y-2">
                <button onClick={()=>{
                    handleUserModalOpen(otherUser)
                }}
                className="p-2 bg-blue-500 text-white rounded"
                >
                    View {otherUser.accountType === 'Hospital' ? 'Hospital' : 'User'} Details
                </button>
                <div className="flex items-center gap-x-2">
                    <p>Status:</p>
                    <Chip
                        bgColor={
                            request.status === "Requested"
                                ? "bg-yellow-500"
                                : request.status === "Accepted"
                                    ? "bg-green-500"
                                    : request.status === "Rejected"
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                        }
                        text={request.status}
                    />
                </div>
                <div className="flex items-center gap-x-2">
                    <p>You:</p>
                    <Chip
                        bgColor={
                           status === "Recipient" ?
                            "bg-blue-500" :
                            "bg-green-500"
                        }
                        text={status}
                    />
                </div>
                <div className="flex items-center gap-x-2">
                    <p>Type:</p>
                    <Chip
                        bgColor={
                            request.requestType === "Post"
                                ? "bg-green-500"
                                : request.requestType === "User"
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                        }
                        text={request.requestType}
                    />
                </div>
                {request?.additionalInfo ? <p>Additional Info: {request.additionalInfo}</p> : null}
                {request.status === 'Accepted' ?
                otherUser?.email ? (
                    <div className="bg-gray-100 p-2">
                        {isRequester ? <p>Greetings! Your Request Has been Accepted</p> : null}
                        <div className="flex items-center gap-x-2">
                            <p>Contact Details:</p>
                            <a
                                href={`mailto:${otherUser.email}`}
                                className="text-blue-500"
                            >
                                Email
                            </a>
                        </div>
                    </div>
                ) : null
                 : null}
            </div>

            {showControl && (
                <div className="mt-2">
                    {request.status === "Requested" && (
                        <>
                            <button
                                disabled={changeMutation.isLoading}
                                className="mr-2 p-2 bg-green-500 text-white rounded"
                                onClick={() => changeMutation.mutate({
                                    id: request._id,
                                    data: {
                                        status: "Accepted",
                                    }
                                })}
                            >
                                Accept
                            </button>
                            <button
                                disabled={changeMutation.isLoading}
                                className="mr-2 p-2 bg-red-500 text-white rounded"
                                onClick={() => changeMutation.mutate({
                                    id: request._id,
                                    data: {
                                        status: "Rejected",
                                    }
                                })}
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {request.status === "Accepted" && (
                        <button
                            disabled={changeMutation.isLoading}
                            className="p-2 bg-blue-500 text-white rounded"
                            onClick={() => handleFulfill(request)}
                        >
                            Fulfill
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}