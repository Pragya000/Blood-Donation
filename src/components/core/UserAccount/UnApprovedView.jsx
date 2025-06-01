import { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import cityData from '../../../data/indian_cities.json'
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { CREATE_USER_DETAILS } from "../../../services/apis";

export default function UserUnApprovedView() {

    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        rhFactor: "",
        cityId: "",
    })

    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
    ];

    const bloodTypeOptions = [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "AB", label: "AB" },
        { value: "O", label: "O" },
    ];

    const rhFactorOptions = [
        { value: "Positive", label: "+" },
        { value: "Negative", label: "-" },
    ];

    const filterCities = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        return inputLength === 0
            ? []
            : cityData.filter(city => {
                const keep =
                    count < 5 &&
                    city.city_ascii.toLowerCase().indexOf(inputValue) >= 0;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
    };

    const promiseOptions = (inputValue) =>
        Promise.resolve(filterCities(inputValue));


    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const mutation = useMutation({
        mutationFn: (payload) => {
            return apiConnector("POST", CREATE_USER_DETAILS, payload);
        },
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            window.location.reload();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong!");
        },
    });

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (isNaN(new Date(formData.dateOfBirth).getTime())) {
            toast.error("Please provide a valid date of birth");
            return;
        }
        let payload = {
            ...formData,
            dateOfBirth: new Date(formData.dateOfBirth),
        }
        e.preventDefault();
        mutation.mutate(payload);
    }

    return (
        <div className='pt-4'>
            <h3 className='text-xl font-bold my-4'>Complete Your Profile</h3>
            <form onSubmit={handleFormSubmit} className="max-w-[600px]">
                <label>Name<sup className="text-red-500">*</sup>:</label>
                <br />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    required
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border border-gray-300 rounded-md w-full px-4 py-2 mb-2"
                />
                <br />
                <div className='flex items-center gap-4 mt-4 mb-6'>
                    <div>
                        <label>Date of Birth<sup className="text-red-500">*</sup>:</label>
                        <br />
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            required
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-[6.5px]"
                        />
                    </div>
                    <div className='flex-1'>
                        <label>Gender<sup className="text-red-500">*</sup>:</label>
                        <br />
                        <Select
                            options={genderOptions}
                            required
                            onChange={(e) => handleInputChange("gender", e.value)}
                        />
                    </div>
                </div>
                <label>Blood Type<sup className="text-red-500">*</sup>:</label>
                <Select
                    options={bloodTypeOptions}
                    required
                    onChange={(e) => handleInputChange("bloodType", e.value)}
                />
                <br />

                <label>Rh Factor<sup className="text-red-500">*</sup>:</label>
                <Select
                    options={rhFactorOptions}
                    required
                    onChange={(e) => handleInputChange("rhFactor", e.value)}
                />
                <br />

                <label>City<sup className="text-red-500">*</sup>:</label>
                <AsyncSelect
                    loadOptions={promiseOptions}
                    value={cityData.find(city => city.id === formData.cityId)}
                    getOptionLabel={option => option.city_ascii}
                    getOptionValue={option => option.id}
                    isSearchable={true}
                    required
                    onChange={(e) => handleInputChange("cityId", e.id)}
                />

                <br />
                <button
                    type="submit"
                    onClick={handleFormSubmit}
                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                    Submit
                </button>
            </form>
            <p className='mt-10 font-bold text-lg'>Note:</p>
            <ul className='list-disc text-sm list-inside pb-10'>
                <li>Your Personal Information is stored in encrypted format and stays secure.</li>
                <li>We will never share your Personal Information with anyone, unless you authorize us.</li>
                <li>This information is needed to provide you best service.</li>
            </ul>
        </div>
    );
}