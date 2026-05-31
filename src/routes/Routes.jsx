import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import DonationRequests from "../pages/DonationRequests";
import DonationRequestDetails from "../pages/DonationRequestDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/Profile";
import CreateDonationRequest from "../pages/CreateDonationRequest";
import DashboardHome from "../pages/DashboardHome";
import MyDonationRequests from "../pages/MyDonationRequests";
import EditDonationRequest from "../pages/EditDonationRequest";
import AllUsers from "../pages/AllUsers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "/donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        path: "edit-donation-request/:id",
        element: <EditDonationRequest />,
      },
      {
        path: "all-users",
        element: <AllUsers />,
      },
      {
        path: "all-blood-donation-request",
        element: <div className="text-xl font-bold">All Blood Donation Requests Page (Placeholder)</div>,
      },
    ],
  },
]);

export default router;
