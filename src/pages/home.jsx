import { useNavigate } from "react-router-dom";
import Logo from "../assets/Blood_logo.jpg";
//import Logo from "../assets/logo.png";
import MyImage from "../components/common/MyImage";
import { useUser } from "../store/useUser";
import Banner from "../assets/front-page-banner.jpg";
import { Link } from 'react-router-dom'; // Add this import at the top of your file
//import { useLocation } from 'react-router-dom'; /

export default function Home() {
  const { isAuth, user } = useUser();
  const navigate = useNavigate();

   return (
      <div className=" min-h-[60vh] flex flex-col items-center justify-center gap-4 md-6  ">
      <MyImage alt="Blood Connect" src={Logo} className="w-[250px]" />

      <button
        onClick={() => {
          if (isAuth) {
            if(user?.accountType === 'Admin') {
              navigate("/admin/home");
            } else {
              navigate("/profile");
            }
          }
          else navigate("/login");
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-10"
      >
        Get Started
      </button>
    </div>
  );
}