export const warehousesDataCreator = (warehouses) => {
  const warehousesData = [];
  try {
    warehouses.map((warehouse) =>
      warehousesData.push({
        id: warehouse.id,
        warehouseName: warehouse.warehouse_name,
        assignedTo: warehouse.assigned_to_name,
        createdAt: warehouse.added_at
      })
    );
  } catch (error) {
    console.log(error);
  }

  return warehousesData;
};

export const warehousesSelectDataCreator = (warehouses) => {
  const warehousesData = [];
  try {
    warehouses.map((warehouse) =>
      warehousesData.push({
        label: warehouse.warehouse_name,
        id: warehouse.id
      })
    );
  } catch (error) {
    console.log(error);
  }

  return warehousesData;
};
