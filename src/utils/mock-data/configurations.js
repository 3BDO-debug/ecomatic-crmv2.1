export const brandsDataCreator = (brands) => {
  const brandsData = [];
  try {
    brands.map((brand) => brandsData.push({ label: brand.brand_name, id: brand.id }));
  } catch (error) {
    console.log(error);
  }
  return brandsData;
};

export const categoriesDataCreator = (categories) => {
  const categoriesData = [];
  try {
    categories.map((category) => categoriesData.push({ label: category.category_name, id: category.id }));
  } catch (error) {
    console.log(error);
  }
  return categoriesData;
};

export const citiesDataCreator = (cities) => {
  const citiesData = [];
  cities.map((city) => citiesData.push({ label: city.city_name, id: city.id }));
  return citiesData;
};

export const regionsDataCreator = (regions) => {
  const regionsData = [];
  regions.map((region) => regionsData.push({ label: region.region_name, id: region.id }));
  return regionsData;
};

export const clientsCategoriesDataCreator = (clientsCategories) => {
  const clientsCategoriesData = [];
  clientsCategories.map((clientCategory) =>
    clientsCategoriesData.push({ label: clientCategory.client_category, id: clientCategory.id })
  );
  return clientsCategoriesData;
};
