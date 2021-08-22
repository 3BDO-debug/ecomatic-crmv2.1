const sidebarTranslation = {
  general: {
    label: 'General',
    children: {
      overview: 'Overview'
    }
  },
  storage: {
    label: 'Storage',
    children: {
      warehouses: 'Warehouses',
      items: {
        label: 'Items',
        children: { createItem: 'Create Item', listItems: 'List Items' }
      },
      spareparts: {
        createSparepart: 'Create Sparepart',
        listSpareparts: 'List Spareparts'
      }
    }
  },
  customerService: {
    label: 'Customer Service',
    children: {
      clients: {
        createClient: 'Create Client',
        listClients: 'List Clients'
      },
      tickets: {
        listTickets: 'List Tickets'
      }
    }
  }
};

export default sidebarTranslation;
