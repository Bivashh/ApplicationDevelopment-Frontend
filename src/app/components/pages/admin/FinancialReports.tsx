import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Calendar, FileText } from "lucide-react";
import { reportsApi } from "../../../api/client";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
  { path: "/admin/parts", label: "Parts Inventory", icon: <Package size={20} /> },
  { path: "/admin/vendors", label: "Vendors", icon: <ShoppingCart size={20} /> },
  { path: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <DollarSign size={20} /> },
  { path: "/admin/reports", label: "Financial Reports", icon: <TrendingUp size={20} /> },
];

export function FinancialReports() {
  const [summary, setSummary] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [topParts, setTopParts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError("");
      try {
        const [summaryData, monthlyData, topPartsData] = await Promise.all([
          reportsApi.financialSummary(),
          reportsApi.monthlySales(),
          reportsApi.topSellingParts(),
        ]);
        setSummary(summaryData);
        setMonthly(monthlyData);
        setTopParts(topPartsData);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Financial Reports</h2>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {loading && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">Loading...</div>}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4"><div className="bg-blue-100 p-3 rounded-lg"><Calendar className="text-blue-600" size={24} /></div><h3 className="text-lg font-bold text-gray-900">Sales</h3></div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Revenue:</span><span className="font-semibold text-green-600">£{Number(summary?.totalSalesRevenue || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Invoices:</span><span className="font-semibold text-gray-900">{summary?.totalSalesInvoices || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Parts Sold:</span><span className="font-semibold text-gray-900">{summary?.totalPartsSold || 0}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4"><div className="bg-red-100 p-3 rounded-lg"><FileText className="text-red-600" size={24} /></div><h3 className="text-lg font-bold text-gray-900">Purchases</h3></div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Cost:</span><span className="font-semibold text-red-600">£{Number(summary?.totalPurchaseCost || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Invoices:</span><span className="font-semibold text-gray-900">{summary?.totalPurchaseInvoices || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Parts Purchased:</span><span className="font-semibold text-gray-900">{summary?.totalPartsPurchased || 0}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4"><div className="bg-green-100 p-3 rounded-lg"><TrendingUp className="text-green-600" size={24} /></div><h3 className="text-lg font-bold text-gray-900">Profit</h3></div>
            <p className="text-4xl font-bold text-green-600">£{Number(summary?.estimatedProfit || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">Estimated from backend report service</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Sales</h3>
            <div className="space-y-3">
              {monthly.map((row, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <span className="text-gray-700">{row.month}</span>
                  <span className="font-semibold">£{Number(row.salesRevenue || 0).toFixed(2)}</span>
                </div>
              ))}
              {monthly.length === 0 && <p className="text-gray-500">No monthly sales data.</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Selling Parts</h3>
            <div className="space-y-3">
              {topParts.map((part, index) => (
                <div key={part.partId || index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{part.partName}</p>
                    <p className="text-sm text-gray-500">{part.partNumber}</p>
                  </div>
                  <span className="font-bold">{part.quantitySold} sold</span>
                </div>
              ))}
              {topParts.length === 0 && <p className="text-gray-500">No top selling part data.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
