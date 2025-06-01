import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { apiConnector } from '../../../services/apiConnector';
import { CREATE_HOSPITAL_DETAILS } from '../../../services/apis';
import toast from 'react-hot-toast';
import AsyncSelect from "react-select/async";
import cityData from '../../../data/indian_cities.json'

export default function HospitalUnApprovedView() {
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [cityId, setCityId] = useState('');
    const [registrationCertificate, setRegistrationCertificate] = useState(null);
    const [hospitalImages, setHospitalImages] = useState([]);
    const [errors, setErrors] = useState({});
  
    const filterCities = (value) => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      let count = 0;
  
      return inputLength === 0
        ? []
        : cityData.filter((city) => {
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
  
    const onDropCertificate = (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        alert('You can only upload one registration certificate.');
        return;
      }
      setRegistrationCertificate(acceptedFiles[0]);
    };
  
    const onDropImages = (acceptedFiles) => {
      if (hospitalImages.length + acceptedFiles.length > 3) {
        alert('You can only upload up to 3 images.');
        return;
      }
      setHospitalImages([...hospitalImages, ...acceptedFiles]);
    };

    const mutation = useMutation({
      mutationFn: (payload) => {
        return apiConnector('POST', CREATE_HOSPITAL_DETAILS, payload);
      },
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        window.location.reload();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong!');
      },
    });
  
    const certificateDropzone = useDropzone({
      onDrop: onDropCertificate,
      disabled: mutation.isLoading,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
      },
      multiple: false,
    });
  
    const imagesDropzone = useDropzone({
      onDrop: onDropImages,
      disabled: mutation.isLoading,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
      },
    });
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // Validate inputs
      const newErrors = {};
      if (!registrationNumber)
        newErrors.registrationNumber = 'Registration number is required';
      if(!hospitalAddress) newErrors.hospitalAddress = 'Hospital address is required';
      if (!hospitalName) newErrors.hospitalName = 'Hospital name is required';
      if (!registrationCertificate)
        newErrors.registrationCertificate = 'Registration certificate is required';
      setErrors(newErrors);
      if (cityId === '') newErrors.cityId = 'City is required';
  
      if (Object.keys(newErrors).length > 0) return;
  
      const formData = new FormData();
      formData.append('hospitalName', hospitalName);
      formData.append('registrationNumber', registrationNumber);
      formData.append('hospitalAddress', hospitalAddress);
      formData.append('cityId', cityId);
      formData.append('registrationCertificate', registrationCertificate);
      hospitalImages.forEach((file, index) => {
        formData.append(`hospitalImages[${index}]`, file);
      });

      mutation.mutate(formData);
      
    };
  
    const clearRegistrationCertificate = () => {
      setRegistrationCertificate(null);
    };
  
    const removeHospitalImage = (index) => {
      setHospitalImages(hospitalImages.filter((_, i) => i !== index));
    };
  
    return (
      <div className='pb-10 pt-4'>
        <h3 className='text-xl font-bold my-4'>Complete Your Profile</h3>
        <form onSubmit={handleSubmit} className='max-w-[600px] space-y-2'>
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
                if(errors.hospitalName) {
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
                if(errors.registrationNumber) {
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
                if(errors.hospitalAddress) {
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
                if(errors.cityId){
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
              Registration Certificate<sup className='text-red-500'>*</sup>:
            </label>
            <br />
            <div
              {...certificateDropzone.getRootProps()}
              className='p-10 border-4 rounded-lg border-gray-300 border-dotted text-center'
            >
              <input {...certificateDropzone.getInputProps()} />
              <p>
                Drag & drop the registration certificate here, or click to select
                file
              </p>
            </div>
            {registrationCertificate && (
              <div>
                <p>{registrationCertificate.name}</p>
                <img
                  src={URL.createObjectURL(registrationCertificate)}
                  alt='Registration Certificate'
                  width='100'
                />
                <button
                  type='button'
                  onClick={clearRegistrationCertificate}
                  className='bg-red-500 text-white rounded-md px-2 py-1 mt-2'
                >
                  Remove
                </button>
              </div>
            )}
            {errors.registrationCertificate && (
              <p className='font-medium text-sm text-red-500'>
                {errors.registrationCertificate}
              </p>
            )}
          </div>
          {/* Hospital Images */}
          <div className='space-y-1'>
            <label>Hospital Images (up to 3):</label>
            <br />
            <div
              {...imagesDropzone.getRootProps()}
              className='p-10 border-4 rounded-lg border-gray-300 border-dotted text-center'
            >
              <input {...imagesDropzone.getInputProps()} />
              <p>
                Drag & drop some files here, or click to select files (maximum 3
                images)
              </p>
            </div>
            <div>
              {hospitalImages.map((file, index) => (
                <div key={index} className='relative inline-block'>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`hospital-${index}`}
                    width='100'
                  />
                  <button
                    type='button'
                    onClick={() => removeHospitalImage(index)}
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-md px-2 py-1'
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={mutation.isLoading}
            type='submit'
            className='bg-blue-500 text-white rounded-md px-4 py-2'
          >
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }