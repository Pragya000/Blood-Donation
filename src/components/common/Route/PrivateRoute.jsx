/* eslint-disable react/prop-types */
import { Link, Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../../store/useUser";
import MyImage from "../MyImage";
//import Logo from "../assets/Blood-logo.png";
import Logo from "../../../assets/Blood_logo.jpg";
import { useLogoutMutation } from "../../../services/mutations/auth";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import { Player } from '@lottiefiles/react-lottie-player';
import RippleLottieFile from '../../../data/lottie/Ripple.json'
import Modal from "../Modal";
import { bloodTypeInfo } from "../../../data/compatibility";
import { MdBloodtype } from "react-icons/md";
//import styles from "./Navbar.css";
//import { Link, useLocation } from "react-router-dom";
// Add this import at the top
//import { ChevronDownIcon } from '@heroicons/react/24/outline';


export default function PrivateRoute({ children }) {
  const { isAuth, accountType, approvalStatus } = useUser();
  const { user } = useUser();
  const mutation = useLogoutMutation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openBloodTypeModal, setOpenBloodTypeModal] = useState(false);

  const fullBloodType = `${user?.additionalFields?.bloodType}${user?.additionalFields?.rhFactor === 'Positive' ? '+' : '-'}`;
  const info = bloodTypeInfo[fullBloodType];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navbarLinks = [
    { to: "/feed", title: "Feed" },
    { to: "/find-donors", title: "Find Donors" },
    { to: "/find-hospitals", title: "Find Hospitals" },
    {
      to: "/profile", title: "Dashboard", subLinks: [
        { to: "/profile/basic-details", title: "Basic Details" },
        { to: "/profile/requests", title: "Requests" },
        { to: "/profile/registrations", title: "Registrations" },
        { to: "/profile/certificates", title: "Certificates", accountType: 'User' },
        { to: "/profile/reviews", title: "Reviews", accountType: 'Hospital' },
      ]
    },
  ];

   
  const renderSidebar = () => {
    return (
      <div className="w-[270px] bg-white flex flex-col h-full border-r-2">
        <div className="flex item-center">
          <button onClick={toggleSidebar} className="md:hidden px-2">
            {isSidebarOpen ? <IoMdClose size={30} /> : <IoIosMenu size={30} />}
          </button>
          <MyImage
            alt="Blood Connect"
            src={Logo}
            className="w-[160px] p-2 py-4"
          />
        </div>
        <div className="flex-1 flex flex-col bg-white">
          {navbarLinks.map((link, index) => {
            return (
              <React.Fragment key={index}>
                <Link
                  to={link.to}
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                  className={`px-4 py-3 border-t-2 border-red-100 ${index === navbarLinks?.length - 1 ? "border-b-2" : ""
                    } ${location.pathname === link.to ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    transition-colors duration-200
          flex items-center justify-between
          `}
           
                >
                  {link.title}
                  {link.subLinks?.length > 0 && (
          <ChevronDownIcon className={`h-5 w-5 transform transition-transform ${
            location.pathname.startsWith(link.to) ? 'rotate-180 text-blue-500' : 'text-gray-400'
          }`} />
        )}
                </Link>
                {link?.subLinks && link.subLinks?.length > 0 ?
                  link.subLinks.map((subLink, subIndex) => {
                    if (subLink.accountType && subLink.accountType !== accountType) {
                      return null
                    }

                    return (<Link
                      key={subIndex}
                      to={subLink.to}
                      onClick={() => {
                        setIsSidebarOpen(false);
                      }}
                      className={`px-8 py-2 text-sm ${subIndex !== 0 ? 'border-t-2' : ''} ${subIndex === link.subLinks?.length - 1 ? "border-b-2" : ""
                        } ${location.pathname === subLink.to ? "bg-gray-200" : ""}`}
                    >
                      {subLink.title}
                    </Link>)
                  })
                  : null}
              </React.Fragment>
            );
          })}
        </div>
        <div className="p-2 py-4">
          <button
            onClick={() => mutation.mutate()}
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  if (isAuth) {

    // Admin should not be able to access the profile page
    if (accountType === 'Admin') {
      return <Navigate to="/admin/home" />;
    }

    // Hospital should not be able to access the certificates page
    if (accountType === 'Hospital' && location.pathname?.split('/')?.[2] === 'certificates') {
      return <Navigate to="/profile" />;
    }

    // User should not be able to access the reviews page
    if (accountType === 'User' && location.pathname?.split('/')?.[2] === 'reviews') {
      return <Navigate to="/profile" />;
    }

    if (location.pathname === '/profile') {
      if (approvalStatus === 'Approved') {
        return <Navigate to="/profile/basic-details" />;
      }
    } else {
      if (approvalStatus !== 'Approved') {
        return <Navigate to="/profile" />;
      }
    }

    return (
      <div>
        <>
        <div className="border-b border-gray-700 py-2 fixed top-0 inset-x-0 bg-gray-900 shadow-sm z-[100] ">
  <div className="flex justify-between items-center w-11/12 max-w-[1200px] mx-auto">
    <div className="flex items-center gap-4 text-white">
                {user?.approvalStatus === 'Approved' ?
                  <button onClick={toggleSidebar} className="md:hidden px-2">
                    {isSidebarOpen ? (
                      <IoMdClose size={30} />
                    ) : (
                      <IoIosMenu size={30} />
                    )}
                  </button> : null}
                <MyImage
                  alt="Blood Connect"
                  src={Logo}
                  className="w-[100px] h-[100px] border rounded-full"
                />
              </div>
              {
                user?.approvalStatus === 'Approved' ?
                  <div className="md:flex items-center gap-6 hidden">
                    {navbarLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.to}
                        className={` text-white ${('/' + location.pathname.split('/')?.[1]) === link.to
                          ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                          : ""
                          }`}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div> : null
              }
              <div className="flex gap-x-2">
                {user?.accountType === 'User' && user?.approvalStatus === 'Approved' ? <button onClick={() => setOpenBloodTypeModal(true)}>
                  <Player
                    autoplay
                    loop
                    src={RippleLottieFile}
                    className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
                  />
                </button> : null}
                <button
                  onClick={() => mutation.mutate()}
                  className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          {isSidebarOpen ? (
            <div className="fixed top-0 left-0 z-[100] h-screen md:hidden">
              {renderSidebar()}
            </div>
          ) : null}
          <Modal
            open={openBloodTypeModal}
            setOpen={setOpenBloodTypeModal}
            title="Know your Blood Type"
            hideFooter={true}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-1">
                <MdBloodtype size={24} className="text-brand" />
                <h3><b>Blood Type:</b></h3>
                <span>
                {`${user?.additionalFields?.bloodType}${user?.additionalFields?.rhFactor === 'Positive' ? '+' : '-'}`}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <MdBloodtype size={24} className="text-brand" />
                  <h3><b>Compatible Donors:</b></h3>
                </div>
                <ul className="list-disc list-inside pl-4">
                  {info?.donors.map((donor, index) => <li key={index}>{donor}</li>)}
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <MdBloodtype size={24} className="text-brand" />
                  <h3><b>Can Donate To:</b></h3>
                </div>
                <ul className="list-inside list-disc pl-4">
                  {info?.recipients.map((recipient, index) => <li key={index}>{recipient}</li>)}
                </ul>
              </div>
            </div>
          </Modal>
        </>
        <div className={'mt-[84px]'}>
          {children}
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}