import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
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
    // Dashboard Routes
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/one" replace /> },
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
            }
          ]
        },
        { path: 'one', element: <PageOne /> }

        /*         {
          path: 'app',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/app/four" replace />
            },
            { path: 'four', element: <PageFour /> },
            { path: 'five', element: <PageFive /> },
            { path: 'six', element: <PageSix /> }
          ]
        } */
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
      element: <MainLayout />,
      children: [{ path: '/', element: <LandingPage /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
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
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
