import { useState } from "react";
import { Outlet, Link, useParams } from "react-router-dom";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import Logo from "../assets/logo.png";
import MyImage from "../components/common/MyImage";
import { useLogoutMutation } from "../services/mutations/auth";
import useCustomTitle from "../hooks/useCustomTitle";

export default function Admin() {

    useCustomTitle('Admin | Blood Donation');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { path } = useParams()
    const mutation = useLogoutMutation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const links = [{
        label: 'Home',
        link: 'home',
        isAdminRoute: true
    }, {
        label: 'Manage Hospitals',
        link: 'hospitals-list',
        isAdminRoute: true
    }, {
        label: 'Create Dummy Users',
        link: 'populate-user',
        isAdminRoute: true
    }]

    const renderSidebar = () => {
        return (
            <div className="w-[270px] flex flex-col h-full border-r-2 bg-white">
                <div className="flex item-center">
                    <button onClick={toggleSidebar} className="md:hidden px-2">
                        {isSidebarOpen ? <IoMdClose size={30} /> : <IoIosMenu size={30} />}
                    </button>
                    <MyImage alt="Blood Connect" src={Logo} className="w-[160px] p-2 py-4" />
                </div>
                <div className="flex-1 flex flex-col">
                    {links.map((link, index) => {
                        return (
                            <Link to={link.isAdminRoute ? `/admin/${link.link}` : link.link} onClick={() => {
                                setIsSidebarOpen(false);
                            }} className={`px-4 py-2 border-t-2 ${index === links?.length - 1 ? 'border-b-2' : ''} ${path === link.link ? 'bg-gray-200' : ''}`} key={index}>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
                <div className="p-2 py-4">
                    <button onClick={() => mutation.mutate()} className="bg-blue-500 text-white rounded-md px-4 py-2">
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="md:hidden flex items-center p-4 sm:px-8 gap-x-2 border-b-2">
                <button onClick={toggleSidebar}>
                    {isSidebarOpen ? <IoMdClose size={30} /> : <IoIosMenu size={30} />}
                </button>
                <div className="flex-1 flex justify-between items-center">
                    <MyImage alt="Blood Connect" src={Logo} className="w-[120px]" />
                    <button onClick={() => mutation.mutate()} className="bg-blue-500 text-white rounded-md px-4 py-2">
                        Logout
                    </button>
                </div>
                {
                    isSidebarOpen ?
                        <div className="fixed top-0 left-0 z-[100] h-screen w-screen">
                            {renderSidebar()}
                        </div>
                        : null
                }
            </div>
            <div className="flex-1 flex">
                <div className="hidden h-screen md:block sticky top-0">
                    {renderSidebar()}
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}