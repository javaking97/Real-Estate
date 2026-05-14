import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from '@/pages/login';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { PublicRoute } from '@/app/router/PublicRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/home';
import { TodayPage } from '@/pages/today';
import { CustomersPage } from '@/pages/customers';
import { CustomerDetail } from '@/pages/customers/CustomerDetail';
import { PropertiesPage } from '@/pages/properties';
import { PropertyDetail } from '@/pages/properties/PropertyDetail';
import { ConsultationsPage } from '@/pages/consultations';
import { SchedulePage } from '@/pages/schedule';
import { TemplatesPage } from '@/pages/templates';
import { TemplateDetail } from '@/pages/templates/TemplateDetail';
import { AnalyticsPage } from '@/pages/analytics';
import { ToolsPage } from '@/pages/tools';
import { SettingsPage } from '@/pages/settings';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'today', element: <TodayPage /> },
          { 
            path: 'customers', 
            element: <CustomersPage />,
            children: [{ path: ':id', element: <CustomerDetail /> }]
          },
          { 
            path: 'properties', 
            element: <PropertiesPage />,
            children: [{ path: ':id', element: <PropertyDetail /> }]
          },
          { 
            path: 'consultations', 
            element: <ConsultationsPage />,
            children: [{ path: ':id', element: <ConsultationsPage /> }]
          },
          { path: 'schedule', element: <SchedulePage /> },
          { 
            path: 'templates', 
            element: <TemplatesPage />,
            children: [{ path: ':id', element: <TemplateDetail /> }]
          },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'tools', element: <ToolsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ]
      }
    ],
  },
  {
    element: <PublicRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
