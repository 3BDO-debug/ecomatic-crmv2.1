export const accountsDataCreator = (accounts) => {
  const accountsData = [];
  try {
    accounts.map((account) =>
      accountsData.push({ label: `${account.first_name} ${account.last_name}`, id: account.id })
    );
  } catch (error) {
    console.log(error);
  }
  return accountsData;
};
