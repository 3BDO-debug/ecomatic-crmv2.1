import * as Yup from 'yup';

export const clientInfoFormDefaults = (clientData) => {
  const clientInfoFormDefaults = {
    fullname: clientData.client_full_name,
    phoneNumber1: clientData.client_phone_number_1,
    phoneNumber2: clientData.client_phone_number_2,
    landline: clientData.client_landline_number,
    city: clientData.client_city,
    region: clientData.client_region,
    address: clientData.client_address,
    buildingNo: clientData.client_building_no,
    floorNo: clientData.client_floor_no,
    apartmentNo: clientData.client_apartment_no,
    landmark: clientData.client_address_landmark,
    category: clientData.client_category
  };
  return clientInfoFormDefaults;
};

export const clientInfoFormValidationSchema = Yup.object().shape({
  fullname: Yup.string().required('Full name is required'),
  phoneNumber1: Yup.string().required('Phone number 1 is required'),
  phoneNumber2: Yup.string().required('Phone number 2 is required'),
  landline: Yup.string().required('Landline is required'),
  city: Yup.string().required('City is required'),
  region: Yup.string().required('Region is required'),
  address: Yup.string().required('Address is required'),
  buildingNo: Yup.string().required('Building no is required'),
  floorNo: Yup.string().required('Floor no is required'),
  apartmentNo: Yup.string().required('Apartment no is required'),
  landmark: Yup.string().required('Landmark is required'),
  category: Yup.string().required('Category is required')
});