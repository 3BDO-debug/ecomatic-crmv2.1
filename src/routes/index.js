import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import AuthGuard from '../guards/AuthGuard';
// context
import {
  WarehousesProvider,
  AccountsProvider,
  ItemsProvider,
  ConfigurationsProvider,
  SparepartsProvider,
  ClientsProvider
} from '../contexts';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: 'auth',
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> }
      ]
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <WarehousesProvider>
            <AccountsProvider>
              <ItemsProvider>
                <ConfigurationsProvider>
                  <SparepartsProvider>
                    <ClientsProvider>
                      <DashboardLayout />
                    </ClientsProvider>
                  </SparepartsProvider>
                </ConfigurationsProvider>
              </ItemsProvider>
            </AccountsProvider>
          </WarehousesProvider>
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/overview" replace /> },
        // GENERAL

        { path: 'overview', element: <Overview /> },
        // STORAGE
        { path: 'warehouses', element: <WarehousesPage /> },
        {
          path: 'items',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/items/list-items" replace />
            },
            {
              path: 'create-item',
              element: <CreateItemPage />
            },
            {
              path: 'list-items',
              element: <ListItemsPage />
            }
          ]
        },
        {
          path: 'spareparts',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/spareparts/list-spareparts" replace />
            },
            {
              path: 'create-sparepart',
              element: <CreateSparepartPage />
            },
            {
              path: 'list-spareparts',
              element: <ListSparepartPage />
            }
          ]
        },
        // CUSTOMER SERVICE
        {
          path: 'clients',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/clients/list-clients" replace />
            },
            {
              path: 'create-client',
              element: <CreateClientPage />
            },
            {
              path: 'list-clients',
              element: <ListClientsPage />
            },
            {
              path: 'client-profile/:clientId',
              element: <ClientProfilePage />
            }
          ]
        },
        {
          path: 'tickets',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/tickets/list-tickets" replace />
            },

            {
              path: 'list-tickets',
              element: <ListTicketsPage />
            },
            {
              path: 'ticket-details/:ticketId',
              element: <TicketDetailsPage />
            }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [{ path: '/', element: <Overview /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS
// *Auth
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// General Pages
const Overview = Loadable(lazy(() => import('../pages/general/Overview')));
// *Storage Pages
const WarehousesPage = Loadable(lazy(() => import('../pages/storage/WarehousesPage')));
// Items Pages
const CreateItemPage = Loadable(lazy(() => import('../pages/storage/items/CreateItemPage')));
const ListItemsPage = Loadable(lazy(() => import('../pages/storage/items/ListItemsPage')));
// Spareparts Pages
const CreateSparepartPage = Loadable(lazy(() => import('../pages/storage/spareparts/CreateSparepartPage')));
const ListSparepartPage = Loadable(lazy(() => import('../pages/storage/spareparts/ListSparepartPage')));
// *Customer Service Pages
// Clients Pages
const CreateClientPage = Loadable(lazy(() => import('../pages/customerService/clients/CreateClientPage')));
const ListClientsPage = Loadable(lazy(() => import('../pages/customerService/clients/ListClientsPage')));
const ClientProfilePage = Loadable(lazy(() => import('../pages/customerService/clients/ClientProfilePage')));
// Tickets Pages
const ListTicketsPage = Loadable(lazy(() => import('../pages/customerService/tickets/ListTicketsPage')));
const TicketDetailsPage = Loadable(lazy(() => import('../pages/customerService/tickets/TicketDetailsPage')));
// 404
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
