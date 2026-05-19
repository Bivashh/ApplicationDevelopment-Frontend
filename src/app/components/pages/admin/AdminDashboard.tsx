import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, Package, DollarSign, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";
import { partsApi, staffApi, lowStockApi, reportsApi, API_BASE_URL } from "../../../api/client";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
  { path: "/admin/parts", label: "Parts Inventory", icon: <Package size={20} /> },
  { path: "/admin/vendors", label: "Vendors", icon: <ShoppingCart size={20} /> },
  { path: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <DollarSign size={20} /> },
  { path: "/admin/reports", label: "Financial Reports", icon: <TrendingUp size={20} /> },
];

export function AdminDashboard() {
  const [stats, setStats] = useState({ staff: 0, parts: 0, lowStock: 0 });
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const [staff, parts, lowStock, financialSummary] = await Promise.all([
          staffApi.getAll(),
          partsApi.getAll(),
          lowStockApi.getActive().catch(() => []),
          reportsApi.financialSummary().catch(() => null),
        ]);
        setStats({ staff: staff.length, parts: parts.length, lowStock: lowStock.length });
        setAlerts(lowStock);
        setSummary(financialSummary);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Connected to backend: {API_BASE_URL}</p>
          </div>
        </div>

        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {loading && <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">Loading backend data...</div>}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4"><Users className="text-blue-600" size={24} /></div>
            <p className="text-gray-600 text-sm">Total Staff</p>
            <p className="text-3xl font-bold text-gray-900">{stats.staff}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-green-100 p-3 rounded-lg w-fit mb-4"><Package className="text-green-600" size={24} /></div>
            <p className="text-gray-600 text-sm">Total Parts</p>
            <p className="text-3xl font-bold text-gray-900">{stats.parts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4"><DollarSign className="text-purple-600" size={24} /></div>
            <p className="text-gray-600 text-sm">Sales Revenue</p>
            <p className="text-3xl font-bold text-gray-900">£{Number(summary?.totalSalesRevenue || 0).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-100 p-3 rounded-lg w-fit mb-4"><AlertTriangle className="text-red-600" size={24} /></div>
            <p className="text-gray-600 text-sm">Low Stock Items</p>
            <p className="text-3xl font-bold text-gray-900">{stats.lowStock}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} /> Low Stock Alerts
            </h3>
            <div className="space-y-3">
              {alerts.length === 0 && <p className="text-gray-500">No active low stock alerts.</p>}
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{alert.partName}</p>
                    <p className="text-sm text-gray-600">{alert.partNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{alert.currentStock} units</p>
                    <p className="text-xs text-gray-500">Min: {alert.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Total Sales Revenue</span><strong>£{Number(summary?.totalSalesRevenue || 0).toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Total Purchase Cost</span><strong>£{Number(summary?.totalPurchaseCost || 0).toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Estimated Profit</span><strong>£{Number(summary?.estimatedProfit || 0).toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Sales Invoices</span><strong>{summary?.totalSalesInvoices || 0}</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Purchase Invoices</span><strong>{summary?.totalPurchaseInvoices || 0}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
