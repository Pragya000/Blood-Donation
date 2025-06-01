import useCustomTitle from "../hooks/useCustomTitle"
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import MyImage from "../components/common/MyImage";

export default  function Error() {

    useCustomTitle("404 | Blood Connect")

    return (
        <div className="w-screen h-screen grid place-content-center">
            <Link to='/'>
            <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
            </Link>
            404 - Page Not Found
        </div>
    )
}