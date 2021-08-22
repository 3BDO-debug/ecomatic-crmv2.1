import * as Yup from 'yup';

export const addWarehouseFormDefaults = {
  warehouseName: '',
  assignedTo: ''
};

export const addWarehouseFormVaildationSchema = Yup.object().shape({
  warehouseName: Yup.string().required('Warehouse Name Is Required'),
  assignedTo: Yup.string().required('You should assign warehouse')
});
