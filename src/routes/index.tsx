import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/features/layout/MainLayout";
import { AssetsPage } from "@/pages/AssetsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { IncidentsPage } from "@/pages/IncidentsPage";
import { VehiclesPage } from "@/pages/VehiclesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "assets", element: <AssetsPage /> },
      { path: "incidents", element: <IncidentsPage /> },
      { path: "vehicles", element: <VehiclesPage /> },
    ],
  },
]);
