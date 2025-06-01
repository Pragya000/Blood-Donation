/* eslint-disable react/prop-types */
// import { useUser } from "../../../store/useUser";
import { FaHospitalAlt } from "react-icons/fa";
import { MdOutlineAppRegistration } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineLocationCity } from "react-icons/md";
import { PiCertificate } from "react-icons/pi";
import { FaImages } from "react-icons/fa6";

export default function HospitalDetails({user, showHeader=true}) {

    // const { user } = useUser();

    return (
        <div className="text-lg pb-10">
            {showHeader ? <p className='text-gray-700 font-medium mt-4 mb-6'>View Your Details:</p> : false}
            <p className="flex items-center space-x-1 font-semibold">
                <FaHospitalAlt className='w-[24px] h-[24px] aspect-square' />
                <span>{user?.additionalFields?.hospitalName}</span>
            </p>
            <p className="flex items-center space-x-1 font-semibold">
                <MdOutlineAppRegistration className='w-[24px] h-[24px] aspect-square' />
                <span>{user?.additionalFields?.registrationNumber}</span>
            </p>
            <p className="flex items-center space-x-1 font-semibold">
                <FaMapLocationDot className='w-[24px] h-[24px] aspect-square' />
                <span>{user?.additionalFields?.hospitalAddress}</span>
            </p>
            <p className="flex items-center space-x-1 font-semibold">
                <MdOutlineLocationCity className='w-[24px] h-[24px] aspect-square' />
                <span>{user?.additionalFields?.city}</span>
            </p>
            <div className="my-6">
                <p className="flex items-center space-x-1 font-semibold">
                    <PiCertificate className='w-[24px] h-[24px] aspect-square' />
                    <span>Registration Certificate</span>
                </p>
                <img src={user?.additionalFields?.registrationCertificate} alt="Registration Certificate" className="w-full h-auto mt-4 max-w-[300px]" />
            </div>
            {user?.additionalFields?.hospitalImages && user?.additionalFields?.hospitalImages.length > 0 ? (
                <div>
                    <p className="flex items-center space-x-1 font-semibold">
                    <FaImages  className='w-[24px] h-[24px] aspect-square'/>
                    <span>Hospital Images</span>
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                    {user?.additionalFields?.hospitalImages?.map((image, index) => (
                        <img key={index} src={image} alt={`Hospital Image ${index}`} className="w-full max-h-[300px] max-w-[300px] object-cover" />
                    ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
}