/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useUser } from "../../../store/useUser";

export default function PublicRoute({children}) {
  const { isAuth, accountType } = useUser();

  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       !isAuth  ? (
  //         <Component {...props} />
  //       ) : (
  //         <Navigate to={ accountType === 'Admin' ? '/admin/home' : '/profile/basic-details' } />
  //       )
  //     }
  //   />
  // )

  // const location = useLocation()

  if (!isAuth) {
    return children
  } else {
    if(accountType === 'Admin') {
      return <Navigate to="/admin/home" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
}