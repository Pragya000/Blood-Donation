/* eslint-disable react/prop-types */
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useParams } from "react-router-dom";
import Home from "../pages/home";
import PublicRoute from "../components/common/Route/PublicRoute";
import PrivateRoute from "../components/common/Route/PrivateRoute";
import AdminRoute from "../components/common/Route/AdminRoute";
import Login from "../pages/login";
import Signup from "../pages/signup";
// import VerifyOtp from "../pages/verifyotp";
import Error from "../pages/error";
import Profile from "../pages/profile";
import AdminHome from "../components/core/AdminAccount/Home";
import HospitalsList from "../components/core/AdminAccount/HospitalsList";
import PopulateUser from "../components/core/AdminAccount/PopulateUser";
import BasicDetails from "../components/core/UserAccount/BasicDetails";
import Requests from "../components/core/UserAccount/Requests";
import Registrations from "../components/core/UserAccount/Registrations";
import Certificates from "../components/core/UserAccount/Certificates";
import Reviews from "../components/core/UserAccount/Reviews";
import Feed from "../pages/feed";
import Admin from "../pages/admin";
import FindDonors from "../pages/find-donors";
import FindHospitals from "../pages/find-hospitals";
import Hospital from "../pages/hospital";
import Post from "../pages/post";
import VerifyCertificate from "../pages/VerifyCertificate";
import Layout from "../components/common/Layout"; // Adjust path as needed


export default function RouterProviderMain() {

  const DynamicAdminComponent = () => {
    const { path } = useParams();

    // Handle different dynamic routes here
    switch (path) {
      case 'home':
        return <AdminHome />;
      case 'hospitals-list':
        return <HospitalsList />;
      case 'populate-user':
        return <PopulateUser />
      default:
        return <Error />;
    }
  };

  const DynamicUserComponent = () => {
    const { path } = useParams();

    // Handle different dynamic routes here
    switch (path) {
      case 'basic-details':
        return <BasicDetails />
      case 'requests':
        return <Requests />
      case 'registrations':
        return <Registrations />
      case 'certificates':
        return <Certificates />
      case 'reviews':
        return <Reviews />
      default:
        return <Error />;
    }

  }

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Home />,
  //   },
  //   {
  //     path: "/login",
  //     element: <PublicRoute>
  //       <Login />
  //     </PublicRoute>
  //     ,
  //   },
  //   {
  //     path: "/signup",
  //     element: <PublicRoute>
  //       <Signup />
  //     </PublicRoute>,
  //   },
  //   {
  //     path: "/verify-otp",
  //     element: <PublicRoute>
  //       <VerifyOtp />
  //     </PublicRoute>,
  //   },
  //   {
  //     path: '/admin',
  //     element: <AdminRoute>
  //       <Admin />
  //     </AdminRoute>,
  //     children: [
  //       {
  //         path: ':path',
  //         element: <DynamicAdminComponent />
  //       }
  //     ]
  //   },
  //   {
  //     path: '/profile',
  //     element: <PrivateRoute>
  //       <Profile />
  //     </PrivateRoute>,
  //     children: [
  //       {
  //         path: ':path',
  //         element: <DynamicUserComponent />
  //       },
  //     ]
  //   },
  //   {
  //     path: '/feed',
  //     element: <PrivateRoute>
  //       <Feed />
  //     </PrivateRoute>,
  //   },
  //   {
  //     path: '/post/:postId',
  //     element: <PrivateRoute>
  //       <Post />
  //     </PrivateRoute>,
  //   },
  //   {
  //     path: '/find-donors',
  //     element: <PrivateRoute>
  //       <FindDonors />
  //     </PrivateRoute>, 
  //   },
  //   {
  //     path: '/find-hospitals',
  //     element: <PrivateRoute>
  //       <FindHospitals />
  //     </PrivateRoute>,
  //   },
  //   {
  //     path: '/hospital/:hospitalId',
  //     element: <PrivateRoute>
  //       <Hospital />
  //     </PrivateRoute>,
  //   },
  //   {
  //     path: "*",
  //     element: <Error />,
  //   },
  // ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with Header */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify/:certId" element={<VerifyCertificate />} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/post/:postId" element={<PrivateRoute><Post /></PrivateRoute>} />
        <Route path="/find-donors" element={<PrivateRoute><FindDonors /></PrivateRoute>} />
        <Route path="/find-hospitals" element={<PrivateRoute><FindHospitals /></PrivateRoute>} />
        <Route path="/hospital/:hospitalId" element={<PrivateRoute><Hospital /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}>
          <Route path=":path" element={<DynamicUserComponent />} />
        </Route>
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>}>
          <Route path=":path" element={<DynamicAdminComponent />} />
        </Route>
      </Route>

      {/* Routes without Header */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Error page outside Layout */}
      <Route path="*" element={<Error />} />
    </>
  )
);


  return <RouterProvider router={router} />;

}


// <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />, */