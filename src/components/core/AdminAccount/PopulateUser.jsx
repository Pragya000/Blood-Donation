import { useState } from "react"
import Select from "react-select";
import AsyncSelect from "react-select/async";
import cityData from '../../../data/indian_cities.json'
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { POPULATE_USER } from "../../../services/apis";

export default function PopulateUser() {

    const [tab, setTab] = useState('user')

    // user states
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        rhFactor: "",
        cityId: "",
    })

    // hospital states
    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [cityId, setCityId] = useState('');
    const [registrationCertificate, setRegistrationCertificate] = useState('');
    const [hospitalImage1, setHospitalImage1] = useState('');
    const [hospitalImage2, setHospitalImage2] = useState('');
    const [hospitalImage3, setHospitalImage3] = useState('');
    const [errors, setErrors] = useState({});

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
            let params = {}
            if (tab === 'user') {
                params = {
                    type: 'user',
                }
            } else {
                params = {
                    type: 'hospital',
                }
            }
            return apiConnector('POST', POPULATE_USER, payload, {}, params);
        },
        onSuccess: (data) => {
            if (data?.data?.success) {
                if (tab === 'hospital') {
                    setEmail('');
                    setRegistrationNumber('');
                    setHospitalName('');
                    setHospitalAddress('');
                    setCityId('');
                    setRegistrationCertificate('');
                    setHospitalImage1('');
                    setHospitalImage2('');
                    setHospitalImage3('');
                    setErrors({});
                } else {
                    setFormData({
                        email: '',
                        name: '',
                        dateOfBirth: "",
                        gender: "",
                        bloodType: "",
                        rhFactor: "",
                        cityId: "",
                    })
                }
            }
            toast.success('Profile updated successfully!');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Something went wrong!');
        },
    });

    // handle user form submission
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

    // handle hospital form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate inputs
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!registrationNumber)
            newErrors.registrationNumber = 'Registration number is required';
        if (!hospitalAddress) newErrors.hospitalAddress = 'Hospital address is required';
        if (!hospitalName) newErrors.hospitalName = 'Hospital name is required';
        if (!registrationCertificate)
            newErrors.registrationCertificate = 'Registration certificate is required';
        setErrors(newErrors);
        if (cityId === '') newErrors.cityId = 'City is required';

        if (Object.keys(newErrors).length > 0) return;

        const formData = new FormData();
        formData.append('email', email);
        formData.append('hospitalName', hospitalName);
        formData.append('registrationNumber', registrationNumber);
        formData.append('hospitalAddress', hospitalAddress);
        formData.append('cityId', cityId);
        formData.append('registrationCertificate', registrationCertificate);
        if (hospitalImage1) formData.append('hospitalImages1', hospitalImage1);
        if (hospitalImage2) formData.append('hospitalImages2', hospitalImage2);
        if (hospitalImage3) formData.append('hospitalImages3', hospitalImage3);

        mutation.mutate(formData);
    };

    return (
        <div className="container mx-auto mt-4">
            <h3 className='font-semibold text-2xl'>Populate User</h3>
            <div className="my-6">
                <button disabled={mutation?.isLoading} onClick={() => setTab('user')} className={`px-4 py-2 ${tab === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>User</button>
                <button disabled={mutation?.isLoading} onClick={() => setTab('hospital')} className={`px-4 py-2 ${tab === 'hospital' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Hospital</button>
            </div>
            {tab === 'user' ? (<>
                <form onSubmit={handleFormSubmit} className="w-[300px] mx-auto md:mx-0 md:w-[600px]">
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
                    <label>Email<sup className="text-red-500">*</sup>:</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        required
                        onChange={(e) => handleInputChange("email", e.target.value)}
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
                        className="bg-blue-500 text-white rounded-md px-4 py-2"
                    >
                        Submit
                    </button>
                </form>
            </>) : tab === 'hospital' ? (<>
                <form onSubmit={handleSubmit} className='w-[300px] mx-auto md:mx-0 md:w-[600px] space-y-2'>
                    {/* Hospital Name */}
                    <div className='space-y-1'>
                        <label>
                            Hospital Name<sup className='text-red-500'>*</sup>:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={hospitalName}
                            onChange={(e) => {
                                if (errors.hospitalName) {
                                    setErrors({
                                        ...errors,
                                        hospitalName: '',
                                    })
                                }
                                setHospitalName(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                        {errors.hospitalName && (
                            <p className='font-medium text-sm text-red-500'>
                                {errors.hospitalName}
                            </p>
                        )}
                    </div>
                    {/* Hospital Email */}
                    <div className='space-y-1'>
                        <label>
                            Email<sup className='text-red-500'>*</sup>:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='email'
                            value={email}
                            onChange={(e) => {
                                if (errors.email) {
                                    setErrors({
                                        ...errors,
                                        email: '',
                                    })
                                }
                                setEmail(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                        {errors.email && (
                            <p className='font-medium text-sm text-red-500'>
                                {errors.email}
                            </p>
                        )}
                    </div>
                    {/* Registration Number */}
                    <div className='space-y-1'>
                        <label>
                            Registration Number<sup className='text-red-500'>*</sup>:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={registrationNumber}
                            onChange={(e) => {
                                if (errors.registrationNumber) {
                                    setErrors({
                                        ...errors,
                                        registrationNumber: '',
                                    })
                                }
                                setRegistrationNumber(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                        {errors.registrationNumber && (
                            <p className='font-medium text-sm text-red-500'>
                                {errors.registrationNumber}
                            </p>
                        )}
                    </div>
                    {/* Hospital Address */}
                    <div className='space-y-1'>
                        <label>
                            Hospital Address<sup className='text-red-500'>*</sup>:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={hospitalAddress}
                            onChange={(e) => {
                                if (errors.hospitalAddress) {
                                    setErrors({
                                        ...errors,
                                        hospitalAddress: '',
                                    })
                                }
                                setHospitalAddress(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                        {errors.hospitalAddress && (
                            <p className='font-medium text-sm text-red-500'>
                                {errors.hospitalAddress}
                            </p>
                        )}
                    </div>
                    {/* City */}
                    <div className='space-y-1'>
                        <label>
                            City<sup className='text-red-500'>*</sup>:
                        </label>
                        <AsyncSelect
                            isDisabled={mutation.isLoading}
                            loadOptions={promiseOptions}
                            value={cityData.find((city) => city.id === cityId)}
                            getOptionLabel={(option) => option.city_ascii}
                            getOptionValue={(option) => option.id}
                            isSearchable={true}
                            onChange={(e) => {
                                if (errors.cityId) {
                                    setErrors({
                                        ...errors,
                                        cityId: '',
                                    })
                                }
                                setCityId(e.id)
                            }}
                        />
                        {errors.cityId && (
                            <p className='font-medium text-sm text-red-500'>{errors.cityId}</p>
                        )}
                    </div>
                    {/* Registration Certificate */}
                    <div className='space-y-1'>
                        <label>
                            Registration Certificate Image Link<sup className='text-red-500'>*</sup>:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={registrationCertificate}
                            placeholder='Paste the image link here'
                            onChange={(e) => {
                                if (errors.registrationCertificate) {
                                    setErrors({
                                        ...errors,
                                        registrationCertificate: '',
                                    })
                                }
                                setRegistrationCertificate(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                        {errors.registrationCertificate && (
                            <p className='font-medium text-sm text-red-500'>
                                {errors.registrationCertificate}
                            </p>
                        )}
                    </div>
                    {/* Hospital Image 1 */}
                    <div className='space-y-1'>
                        <label>
                            Hospital Image 1 Link:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={hospitalImage1}
                            placeholder='Paste the image link here'
                            onChange={(e) => {
                                setHospitalImage1(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                    </div>
                    {/* Hospital Image 2 */}
                    <div className='space-y-1'>
                        <label>
                            Hospital Image 2 Link:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={hospitalImage2}
                            placeholder='Paste the image link here'
                            onChange={(e) => {
                                setHospitalImage2(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                    </div>
                    {/* Hospital Image 3 */}
                    <div className='space-y-1'>
                        <label>
                            Hospital Image 3 Link:
                        </label>
                        <br />
                        <input
                            disabled={mutation.isLoading}
                            type='text'
                            value={hospitalImage3}
                            placeholder='Paste the image link here'
                            onChange={(e) => {
                                setHospitalImage3(e.target.value)
                            }}
                            className='border border-gray-300 rounded-md w-full px-4 py-2 mb-2'
                        />
                    </div>
                    <button
                        disabled={mutation.isLoading}
                        type='submit'
                        className='bg-blue-500 text-white rounded-md px-4 py-2'
                    >
                        {mutation.isLoading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </>) : null}
        </div>
    )
}