/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useUser } from "../../../store/useUser";

export default function AdminRoute({children}) {
  const { isAuth, accountType } = useUser();
  // const location = useLocation();

  if (isAuth) {

    if(accountType !== 'Admin') {
      return <Navigate to="/profile" />;
    }

    return children
  } else {
    return <Navigate to="/login"/>;
  }

  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       isAuth  ? (
  //         <>
  //         {accountType !== 'Admin'? <Navigate to="/profile" /> : <Component {...props} />}
  //         </>
  //       ) : (
  //         <Navigate to="/login" />
  //       )
  //     }
  //   />
  // )
}