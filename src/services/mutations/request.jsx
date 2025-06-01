/* eslint-disable no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../apiConnector";
import { CREATE_REQUEST } from "../apis";
import toast from "react-hot-toast";

export const useRequestMutation = ({
    payload=null,
    onSuccess=()=>{},
}) => {
    const mutation = useMutation({
        mutationFn: () => {
            return apiConnector("POST", CREATE_REQUEST, payload);
        },
        onSuccess: () => {
            onSuccess();
            toast.success("Request created successfully", {
                duration: 5000,
                position: 'bottom-right'
            });
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Something went wrong",
                {
                    duration: 5000,
                    position: 'bottom-right'
                }
            );
        },
    });
    
    return mutation;
}