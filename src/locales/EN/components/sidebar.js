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
        children: { createItem: 'Create item', listItems: 'List items' }
      },
      spareparts: {
        label: 'Spareparts',
        children: { createSparepart: 'Add sparepart', listSpareparts: 'List spareparts' }
      }
    }
  },
  customerService: {
    label: 'Customer service',
    children: {
      clients: {
        label: 'Clients',
        children: {
          createClient: 'Add client',
          listClients: 'List clients'
        }
      },
      tickets: {
        label: 'Tickets',
        children: {
          listTickets: 'List tickets'
        }
      }
    }
  }
};

export default sidebarTranslation;
