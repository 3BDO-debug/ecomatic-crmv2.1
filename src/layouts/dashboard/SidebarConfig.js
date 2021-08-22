// components
import { Icon } from '@iconify/react';
// hooks
import useLocales from '../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'Overview',
        path: PATH_DASHBOARD.general.overview,
        icon: <Icon icon="grommet-icons:overview" width={24} height={24} />
      }
    ]
  },
  // STORAGE
  // ----------------------------------------------------------------------
  {
    subheader: 'storage',
    items: [
      {
        title: 'Warehouses',
        path: PATH_DASHBOARD.storage.warehousesPage,
        icon: <Icon icon="maki:warehouse" width={24} height={24} />
      },
      {
        title: 'Items',
        path: PATH_DASHBOARD.storage.items.root,
        icon: <Icon icon="carbon:block-storage-alt" width={24} height={24} />,
        children: [
          { title: 'Create Item', path: PATH_DASHBOARD.storage.items.createItemPage },
          { title: 'List Items', path: PATH_DASHBOARD.storage.items.listItemsPage }
        ]
      },
      {
        title: 'Spareparts',
        path: PATH_DASHBOARD.storage.spareparts.root,
        icon: <Icon icon="eos-icons:rotating-gear" width={24} height={24} />,
        children: [
          { title: 'Create Sparepart', path: PATH_DASHBOARD.storage.spareparts.createSparepartPage },
          { title: 'List Spareparts', path: PATH_DASHBOARD.storage.spareparts.listSparepartPage }
        ]
      }
    ]
  },
  // STORAGE
  // ----------------------------------------------------------------------
  {
    subheader: 'customer service',
    items: [
      {
        title: 'Clients',
        path: PATH_DASHBOARD.customerService.clients.root,
        icon: <Icon icon="fluent:people-audience-24-regular" width={24} height={24} />,
        children: [
          { title: 'Create Client', path: PATH_DASHBOARD.customerService.clients.createClientPage },
          { title: 'List Clients', path: PATH_DASHBOARD.customerService.clients.listClientPage }
        ]
      },
      {
        title: 'Tickets',
        path: PATH_DASHBOARD.customerService.tickets.listTicketsPage,
        icon: <Icon icon="akar-icons:ticket" width={24} height={24} />
      }
    ]
  }
];

export default sidebarConfig;
