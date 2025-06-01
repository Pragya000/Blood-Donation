import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../apiConnector";
import { LOGOUT } from "../apis";
import toast from "react-hot-toast";
import { useUser } from "../../store/useUser";
import { useNavigate } from "react-router-dom";

export const useLogoutMutation = () => {

    const { setIsAuth, setUser, setAccountType, setApprovalStatus } = useUser()
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () => {
            return apiConnector("POST", LOGOUT);
        },
        onSuccess: () => {
            setIsAuth(false);
            setUser(null);
            setAccountType(null);
            setApprovalStatus(null);
            navigate("/login");
            toast.success("Logged Out Successfully");
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });
    return mutation;
}