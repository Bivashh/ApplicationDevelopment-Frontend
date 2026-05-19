import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { UserPlus, ShoppingCart, Search, FileText, TrendingUp, Package, Calendar, Star } from "lucide-react";
import { salesApi } from "../../../api/client";

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

export function StaffDashboard() {
  const [sales, setSales] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    salesApi.getAll().then(setSales).catch((err) => setError(err.message || "Failed to load sales"));
  }, []);

  const totalRevenue = sales.reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0);

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Staff Dashboard</h2>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><ShoppingCart className="text-blue-600 mb-3" size={28} /><p className="text-gray-600 text-sm">Sales Invoices</p><p className="text-3xl font-bold">{sales.length}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><Package className="text-green-600 mb-3" size={28} /><p className="text-gray-600 text-sm">Revenue</p><p className="text-3xl font-bold">£{totalRevenue.toFixed(2)}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><UserPlus className="text-purple-600 mb-3" size={28} /><p className="text-gray-600 text-sm">Main Task</p><p className="text-xl font-bold">Register & Sell</p></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
              <tbody className="divide-y">
                {sales.slice(0, 8).map(invoice => (
                  <tr key={invoice.invoiceId || invoice.id}>
                    <td className="px-4 py-3">#{invoice.invoiceId || invoice.id}</td>
                    <td className="px-4 py-3">{invoice.customerId}</td>
                    <td className="px-4 py-3">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3">£{Number(invoice.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{invoice.paymentStatus}</td>
                  </tr>
                ))}
                {sales.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No sales yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
