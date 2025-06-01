 //import Header from "./Header"; // adjust the path as needed
 import Footer from "./Footer";
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
     
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;

// <Header />
