import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Plus, Edit, Trash2, AlertTriangle, X } from "lucide-react";
import { lowStockApi, partsApi } from "../../../api/client";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
  { path: "/admin/parts", label: "Parts Inventory", icon: <Package size={20} /> },
  { path: "/admin/vendors", label: "Vendors", icon: <ShoppingCart size={20} /> },
  { path: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <DollarSign size={20} /> },
  { path: "/admin/reports", label: "Financial Reports", icon: <TrendingUp size={20} /> },
];

const emptyForm = {
  name: "",
  partNumber: "",
  category: "",
  description: "",
  unitPrice: "",
  stockQuantity: "",
  lowStockThreshold: "10",
};

export function PartsManagement() {
  const [parts, setParts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [partsData, alertData] = await Promise.all([
        partsApi.getAll(),
        lowStockApi.getActive().catch(() => []),
      ]);
      setParts(partsData);
      setAlerts(alertData);
    } catch (err: any) {
      setError(err.message || "Failed to load parts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const submitPart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const payload = {
      name: form.name,
      partNumber: form.partNumber,
      category: form.category,
      description: form.description,
      unitPrice: Number(form.unitPrice),
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
    };
    try {
      if (editingId) {
        await partsApi.update(editingId, payload);
        setMessage("Part updated successfully.");
      } else {
        await partsApi.create(payload);
        setMessage("Part created successfully.");
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save part");
    }
  };

  const editPart = (part: any) => {
    setEditingId(part.id);
    setForm({
      name: part.name || "",
      partNumber: part.partNumber || "",
      category: part.category || "",
      description: part.description || "",
      unitPrice: String(part.unitPrice ?? ""),
      stockQuantity: String(part.stockQuantity ?? ""),
      lowStockThreshold: String(part.lowStockThreshold ?? 10),
    });
    setShowForm(true);
  };

  const deletePart = async (id: number) => {
    if (!confirm("Delete this part?")) return;
    setError("");
    setMessage("");
    try {
      await partsApi.delete(id);
      setMessage("Part deleted successfully.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to delete part");
    }
  };

  const generateAlerts = async () => {
    try {
      await lowStockApi.generate();
      setMessage("Low stock alerts generated.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to generate alerts");
    }
  };

  const resolveAlert = async (id: number) => {
    try {
      await lowStockApi.resolve(id);
      setMessage("Alert resolved.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to resolve alert");
    }
  };

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Parts Inventory</h2>
          <div className="flex gap-3">
            <button onClick={generateAlerts} className="bg-orange-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700">
              <AlertTriangle size={20} /> Generate Alerts
            </button>
            <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700">
              <Plus size={20} /> Add New Part
            </button>
          </div>
        </div>

        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {loading && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">Loading...</div>}

        {showForm && (
          <form onSubmit={submitPart} className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Part" : "Add Part"}</h3>
              <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X size={22} /></button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input required placeholder="Part name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required placeholder="Part number" value={form.partNumber} onChange={e => setForm({ ...form, partNumber: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required type="number" step="0.01" placeholder="Unit price" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required type="number" placeholder="Stock quantity" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required type="number" placeholder="Low stock threshold" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="md:col-span-3 px-4 py-2 border rounded-lg" />
            </div>
            <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">{editingId ? "Update Part" : "Create Part"}</button>
          </form>
        )}

        {alerts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 mb-8">
            <h3 className="font-bold text-orange-900 mb-3">Active Low Stock Alerts</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{alert.partName}</p>
                    <p className="text-sm text-gray-600">Stock {alert.currentStock} / Threshold {alert.threshold}</p>
                  </div>
                  <button onClick={() => resolveAlert(alert.id)} className="text-sm bg-green-600 text-white px-3 py-2 rounded-lg">Resolve</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parts.map(part => {
                const isLowStock = part.isLowStock || Number(part.stockQuantity) <= Number(part.lowStockThreshold);
                return (
                  <tr key={part.id} className={`hover:bg-gray-50 ${isLowStock ? "bg-red-50" : ""}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{part.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{part.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{part.partNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{part.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{part.stockQuantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">£{Number(part.unitPrice || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {isLowStock ? <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Low Stock</span> : <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button onClick={() => editPart(part)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                        <button onClick={() => deletePart(part.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {parts.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No parts found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
