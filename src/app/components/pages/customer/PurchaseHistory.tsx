import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Calendar, Package, Star, History, TrendingUp, User } from "lucide-react";
import { customersApi } from "../../../api/client";

const menuItems = [
  { path: "/customer", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/customer/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/customer/appointment", label: "Book Appointment", icon: <Calendar size={20} /> },
  { path: "/customer/request-parts", label: "Request Parts", icon: <Package size={20} /> },
  { path: "/customer/review", label: "Submit Review", icon: <Star size={20} /> },
  { path: "/customer/history", label: "Purchase History", icon: <History size={20} /> },
];

export function PurchaseHistory() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    customersApi.me().then(setProfile).catch((err) => setError(err.message || "Failed to load customer profile"));
  }, []);

  return (
    <DashboardLayout role="customer" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Purchase History</h2>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-600 text-sm">Total Spent</p><p className="text-3xl font-bold text-gray-900">£{Number(profile?.totalSpent || 0).toFixed(2)}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-600 text-sm">Credit Balance</p><p className="text-3xl font-bold text-gray-900">£{Number(profile?.creditBalance || 0).toFixed(2)}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-600 text-sm">Credit Due Date</p><p className="text-xl font-bold text-gray-900">{profile?.creditDueDate ? new Date(profile.creditDueDate).toLocaleDateString() : "None"}</p></div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Backend note</h3>
          <p className="text-sm text-blue-800">The backend has customer profile totals, but it does not expose a customer-only sales history endpoint. The admin endpoint is <strong>/api/customers/{'{customerId}'}/history</strong>, so customer purchase history can be completed after adding a customer self-history endpoint in the backend.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
