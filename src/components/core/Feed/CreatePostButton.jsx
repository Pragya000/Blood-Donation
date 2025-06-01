/* eslint-disable react/prop-types */
import { useState } from "react";
import { useUser } from "../../../store/useUser";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "../../common/Modal";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { CREATE_POST } from "../../../services/apis";
import toast from "react-hot-toast";

export default function CreatePostButton({refetch}) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", CREATE_POST, payload);
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        setOpen(false);
      }
      toast.success("Profile updated successfully!");
      refetch()
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = () => {
    const additionalInfo = document.getElementById('create-post-textarea').value
    
    if(user?.accountType === 'User') {
        const check = document.getElementById('create-post-check').checked
        if(!check) {
            toast.error('Authorization is Required')
            return
        }
        mutation.mutate({
            additionalInfo: additionalInfo
        })
    } else {
        const date = document.getElementById('create-post-date').value
        const time = document.getElementById('create-post-time').value
        const totalSeats = document.getElementById('create-post-seats').value

        if(!date || !time || !totalSeats) {
            toast.error('Fill up all the details')
            return
        }

        const timingString = `${date}T${time}:00`

        if(isNaN(totalSeats) || totalSeats < 0 || totalSeats > 1000) {
            toast.error('Please enter valid seats')
            return
        }

        if(isNaN(new Date(timingString).getTime())) {
            toast.error('Please enter valid timing')
            return
        }

        const payload = {
            timing: timingString,
            totalSeats
        }

        if(additionalInfo) {
            payload['additionalInfo'] = additionalInfo
        }

        mutation.mutate(payload)
    }

  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 hover:bg-opacity-90 text-white rounded-md px-4 py-2 flex items-center gap-x-2"
      >
        <AiOutlinePlusCircle className="text-xl" />{" "}
        {user?.accountType === "User"
          ? "Post a Requirement"
          : "Post a Blood Donation Camp"}
      </button>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          user?.accountType === "User"
            ? "Post a Requirement"
            : "Post a Blood Donation Camp"
        }
        isDisabled={mutation.isLoading}
        btnText={mutation.isLoading ? "Creating..." : "Create"}
        submitHandler={handleSubmit}
      >
        <div className="p-4 space-y-2">
          {user?.accountType === "Hospital" ? (
            <>
              <div>
                <label>
                  Timing<sup className="text-red-500">*</sup>:
                </label>
                <br />
                <div className="w-full flex flex-wrap gap-2">
                  <input
                    id="create-post-date"
                    type="date"
                    name="date"
                    required
                    className="border border-gray-300 rounded-md px-4 py-[6.5px] flex-1"
                  />
                  <input
                    id="create-post-time"
                    type="time"
                    name="time"
                    required
                    className="border border-gray-300 rounded-md px-4 py-[6.5px] flex-1"
                  />
                </div>
              </div>
              <div className="w-full">
                <label>
                  Total Seats<sup className="text-red-500">*</sup>:
                </label>
                <br />
                <input
                  id="create-post-seats"
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  name="totalSeats"
                  placeholder="Enter total seats"
                  required
                  className="border border-gray-300 rounded-md px-4 py-[6.5px] w-full"
                />
              </div>
            </>
          ) : null}
          <textarea
            id="create-post-textarea"
            className="w-full border border-gray-300 rounded-md p-2 min-h-[120px]"
            placeholder="Write any additional information here..."
          />
          {user?.accountType === "User" ? (
                <div className="flex gap-x-2">
                  <input id="create-post-check" type="checkbox" />
                  <p className="text-sm">
                    I authorize to use my details (Blood Type, Rh Factor, Gender, City) for the purpose of finding a donor.
                  </p>
                </div>
              ) : null}
        </div>
      </Modal>
    </>
  );
}
