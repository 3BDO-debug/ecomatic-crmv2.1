export default function MUIDatatable() {
  return {
    MUIDataTableFilterList: {
      styleOverrides: {
        root: {
          margin: '0px 16px 16px 16px'
        }
      }
    },
    MUIDataTableViewCol: {
      styleOverrides: {
        root: {
          padding: '25px !important'
        }
      }
    },
    MUIDataTableToolbar: {
      styleOverrides: {
        actions: {
          flex: '1 1 1'
        }
      }
    },
    MUIDataTableSearch: {
      styleOverrides: {
        main: {
          alignItems: 'center'
        }
      }
    }
  };
}
