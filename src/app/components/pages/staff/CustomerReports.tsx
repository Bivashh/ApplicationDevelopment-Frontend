import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { UserPlus, ShoppingCart, Search, FileText, TrendingUp, Package, Calendar, Star } from "lucide-react";
import { customersApi } from "../../../api/client";

const menuItems = [
  { path: "/staff", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/staff/register-customer", label: "Register Customer", icon: <UserPlus size={20} /> },
  { path: "/staff/sales", label: "Parts Sales", icon: <ShoppingCart size={20} /> },
  { path: "/staff/search", label: "Customer Search", icon: <Search size={20} /> },
  { path: "/staff/reports", label: "Customer Reports", icon: <FileText size={20} /> },
  { path: "/staff/appointments", label: "Appointments", icon: <Calendar size={20} /> },
  { path: "/staff/part-requests", label: "Part Requests", icon: <Package size={20} /> },
  { path: "/staff/reviews", label: "Reviews", icon: <Star size={20} /> }, 
];

export function CustomerReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    customersApi.reports().then(setReports).catch((err) => setError(err.message || "Failed to load reports. Backend currently authorizes this endpoint for Admin only."));
  }, []);

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reports</h2>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left">Customer ID</th><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Phone</th><th className="px-6 py-3 text-left">Vehicles</th><th className="px-6 py-3 text-left">Orders</th><th className="px-6 py-3 text-left">Spent</th><th className="px-6 py-3 text-left">Credit</th></tr></thead>
            <tbody className="divide-y">
              {reports.map(row => (
                <tr key={row.customerId}><td className="px-6 py-4">{row.customerId}</td><td className="px-6 py-4">{row.fullName}</td><td className="px-6 py-4">{row.email}</td><td className="px-6 py-4">{row.phone}</td><td className="px-6 py-4">{row.totalVehicles}</td><td className="px-6 py-4">{row.totalOrders}</td><td className="px-6 py-4">£{Number(row.totalSpent || 0).toFixed(2)}</td><td className="px-6 py-4">£{Number(row.creditBalance || 0).toFixed(2)}</td></tr>
              ))}
              {reports.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No report data.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
