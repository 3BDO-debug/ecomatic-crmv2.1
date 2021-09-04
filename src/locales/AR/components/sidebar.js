const sidebarTranslation = {
  general: {
    label: 'الرئيسية',
    children: {
      overview: 'نظرة عامة'
    }
  },
  storage: {
    label: 'المخزن',
    children: {
      warehouses: 'المستودعات',
      items: {
        label: 'العناصر',
        children: { createItem: 'اضافة عنصر', listItems: 'عرض العناصر' }
      },
      spareparts: {
        label: 'قطع الغيار',
        children: { createSparepart: 'اضافة قطعة غيار', listSpareparts: 'عرض قطع الغيار' }
      }
    }
  },
  customerService: {
    label: 'خدمة العملاء',
    children: {
      clients: {
        label: 'العملاء',
        children: {
          createClient: 'اضافة عميل',
          listClients: 'عرض العملاء'
        }
      },
      tickets: {
        label: 'التيكتس',
        children: {
          listTickets: 'عرض التيكتس'
        }
      }
    }
  }
};

export default sidebarTranslation;
