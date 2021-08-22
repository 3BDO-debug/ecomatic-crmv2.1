// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    overview: path(ROOTS_DASHBOARD, '/overview')
  },
  storage: {
    warehousesPage: path(ROOTS_DASHBOARD, '/warehouses'),
    items: {
      root: path(ROOTS_DASHBOARD, '/items'),
      createItemPage: path(ROOTS_DASHBOARD, '/items/create-item'),
      listItemsPage: path(ROOTS_DASHBOARD, '/items/list-items')
    },
    spareparts: {
      root: path(ROOTS_DASHBOARD, '/spareparts'),
      createSparepartPage: path(ROOTS_DASHBOARD, '/spareparts/create-sparepart'),
      listSparepartPage: path(ROOTS_DASHBOARD, '/spareparts/list-spareparts')
    }
  },
  customerService: {
    clients: {
      root: path(ROOTS_DASHBOARD, '/clients'),
      createClientPage: path(ROOTS_DASHBOARD, '/clients/create-client'),
      listClientPage: path(ROOTS_DASHBOARD, '/clients/list-clients')
    },
    tickets: {
      root: path(ROOTS_DASHBOARD, '/tickets'),
      listTicketsPage: path(ROOTS_DASHBOARD, '/tickets/list-tickets')
    }
  }
};
