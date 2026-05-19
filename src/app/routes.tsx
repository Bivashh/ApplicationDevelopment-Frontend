import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { AdminDashboard } from "./components/pages/admin/AdminDashboard";
import { StaffManagement } from "./components/pages/admin/StaffManagement";
import { PartsManagement } from "./components/pages/admin/PartsManagement";
import { VendorManagement } from "./components/pages/admin/VendorManagement";
import { PurchaseInvoice } from "./components/pages/admin/PurchaseInvoice";
import { FinancialReports } from "./components/pages/admin/FinancialReports";
import { StaffDashboard } from "./components/pages/staff/StaffDashboard";
import { CustomerRegistration } from "./components/pages/staff/CustomerRegistration";
import { PartsSales } from "./components/pages/staff/PartsSales";
import { CustomerSearch } from "./components/pages/staff/CustomerSearch";
import { CustomerReports } from "./components/pages/staff/CustomerReports";
import { CustomerDashboard } from "./components/pages/customer/CustomerDashboard";
import { ProfileManagement } from "./components/pages/customer/ProfileManagement";
import { BookAppointment } from "./components/pages/customer/BookAppointment";
import { RequestParts } from "./components/pages/customer/RequestParts";
import { SubmitReview } from "./components/pages/customer/SubmitReview";
import { PurchaseHistory } from "./components/pages/customer/PurchaseHistory";
import { NotFound } from "./components/pages/NotFound";
import { StaffAppointments } from "./components/pages/staff/StaffAppointments";
import { PartRequests } from "./components/pages/staff/PartRequests";
import { StaffReviews } from "./components/pages/staff/StaffReviews";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },

      { path: "admin", Component: AdminDashboard },
      { path: "admin/staff", Component: StaffManagement },
      { path: "admin/parts", Component: PartsManagement },
      { path: "admin/vendors", Component: VendorManagement },
      { path: "admin/purchase-invoice", Component: PurchaseInvoice },
      { path: "admin/reports", Component: FinancialReports },

      { path: "staff", Component: StaffDashboard },
      { path: "staff/register-customer", Component: CustomerRegistration },
      { path: "staff/sales", Component: PartsSales },
      { path: "staff/search", Component: CustomerSearch },
      { path: "staff/reports", Component: CustomerReports },
      { path: "staff/appointments", Component: StaffAppointments },
      { path: "staff/part-requests", Component: PartRequests },
      { path: "staff/reviews", Component: StaffReviews },

      { path: "customer", Component: CustomerDashboard },
      { path: "customer/profile", Component: ProfileManagement },
      { path: "customer/appointment", Component: BookAppointment },
      { path: "customer/request-parts", Component: RequestParts },
      { path: "customer/review", Component: SubmitReview },
      { path: "customer/history", Component: PurchaseHistory },
      { path: "*", Component: NotFound },

    ],
  },
]);
