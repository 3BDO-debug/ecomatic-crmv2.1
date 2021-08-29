import { Avatar } from '@material-ui/core';
import { mainUrl } from '../../../APIs/axios';

export const itemsDataCreator = (items) => {
  const itemsData = [];
  try {
    items.map((item) =>
      itemsData.push({
        id: item.id,
        modelNumber: item.item_model_number,
        img: <Avatar src={`${mainUrl}/${item.item_img}`} />,
        brand: item.brand,
        category: item.category,
        createdAt: item.added_at
      })
    );
  } catch (error) {
    console.log(error);
  }
  return itemsData;
};
