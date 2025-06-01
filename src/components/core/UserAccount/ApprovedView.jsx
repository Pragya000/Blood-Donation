import PropTypes from 'prop-types'
import { useUser } from '../../../store/useUser'
import { Link, useLocation } from 'react-router-dom'

export default function UserApprovedView({ children }) {
    const { accountType } = useUser()
    const location = useLocation()
    const profileLinks = [
        { to: "/profile/basic-details", title: "Basic Details" },
        { to: "/profile/requests", title: "Requests" },
        { to: "/profile/registrations", title: "Registrations" },
        { to: "/profile/certificates", title: "Certificates", accountType: 'User' },
        { to: "/profile/reviews", title: "Reviews", accountType: 'Hospital' },
    ]

    return (
        <div className='h-[calc(100vh-84px)] flex'>
            <div className="md:w-[200px] lg:w-[270px] h-full border-r border-r-gray-300 hidden md:flex flex-col fixed left-0  ">
                {profileLinks.map((subLink, subIndex) => {
                    if (subLink.accountType && subLink.accountType !== accountType) {
                        return null
                    }

                    return (<Link
                        key={subIndex}
                        to={subLink.to}
                        className={`px-4 py-2 ${subIndex !== 0 ? 'border-t-2' : ''} ${subIndex === profileLinks?.length - 1 ? "border-b-2" : ""
                            } ${location.pathname === subLink.to ? "bg-gray-200" : ""}`}
                    >
                        {subLink.title}
                    </Link>)
                })}
            </div>
            <div className='overflow-y-auto flex-1'>
                <div className='w-11/12 mx-auto md:mx-0 md:pl-10 max-w-[1200px]'>
                {children}
                </div>
            </div>
        </div>
    )
}

UserApprovedView.propTypes = {
    children: PropTypes.node.isRequired,
}