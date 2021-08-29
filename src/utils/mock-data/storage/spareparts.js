import { Avatar } from '@material-ui/core';
import { mainUrl } from '../../../APIs/axios';

export const sparepartsDataCreator = (spareparts) => {
  const sparepartsData = [];
  try {
    spareparts.map((sparepart) =>
      sparepartsData.push({
        id: sparepart.id,
        modelNumber: sparepart.spare_part_model_number,
        img: <Avatar src={`${mainUrl}/${sparepart.spare_part_img}`} />,
        createdAt: sparepart.added_at
      })
    );
  } catch (error) {
    console.log(error);
  }
  return sparepartsData;
};
