const sidebarTranslation = {
  general: {
    label: 'عام',
    children: {
      overview: 'ملخص'
    }
  },
  storage: {
    label: 'المساحه',
    children: {
      warehouses: 'مستودع',
      items: {
        label: 'عناصر',
        children: { createItem: 'انشاء عنصر', listItems: 'قائمة العناصر' }
      },
      spareparts: {
        createSparepart: 'انشاء قطع غيار',
        listSpareparts: 'قائمة قطع الغيار '
      }
    }
  },
  customerService: {
    label: 'خدمة العملاء',
    children: {
      clients: {
        createClient: 'انشاء عميل',
        listClients: 'قائمة العملاء'
      },
      tickets: {
        listTickets: 'قائمة التزاكر'
      }
    }
  }
};

export default sidebarTranslation;
