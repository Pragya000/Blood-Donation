import { useParams } from "react-router-dom"
import { apiConnector } from "../services/apiConnector";
import { VERIFY_CERTIFICATE } from "../services/apis";
import { useQuery } from "@tanstack/react-query";
import RenderCertificate from "../components/core/Certificate/RenderCertificate";

async function fetchCertificate(certId) {
    const data = await apiConnector('GET', VERIFY_CERTIFICATE + `/${certId}`)
    return data
}

export default function VerifyCertificate() {

    const { certId } = useParams()

    const { data, isLoading, isError, error } = useQuery(
        ["certificate", certId],
        () => fetchCertificate(certId),
        {
            keepPreviousData: true,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
        }
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data?.data?.certificate) {
        return <div>Error: {error?.message || "Something Went Wrong!"}</div>;
    }

    const certificate = data?.data?.certificate

    return (
        <div className='p-6'>
            <h1 className="my-4 font-bold text-xl">This is a Verified Cerificate Provided to {certificate?.user?.name}</h1>
            <RenderCertificate certificate={certificate} userName={certificate?.user?.name} />
        </div>
    )
}