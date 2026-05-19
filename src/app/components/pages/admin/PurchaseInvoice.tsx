import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Plus, X } from "lucide-react";
import { partsApi, purchaseApi, vendorsApi } from "../../../api/client";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
  { path: "/admin/parts", label: "Parts Inventory", icon: <Package size={20} /> },
  { path: "/admin/vendors", label: "Vendors", icon: <ShoppingCart size={20} /> },
  { path: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <DollarSign size={20} /> },
  { path: "/admin/reports", label: "Financial Reports", icon: <TrendingUp size={20} /> },
];

const emptyForm = {
  invoiceNumber: "",
  vendorId: "",
  purchaseDate: new Date().toISOString().slice(0, 10),
  notes: "",
  partId: "",
  quantity: "1",
  unitCost: "",
};

export function PurchaseInvoice() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [invoiceData, vendorData, partData] = await Promise.all([
        purchaseApi.getAll(),
        vendorsApi.getAll(),
        partsApi.getAll(),
      ]);
      setInvoices(invoiceData);
      setVendors(vendorData);
      setParts(partData);
    } catch (err: any) {
      setError(err.message || "Failed to load purchase data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addItem = () => {
    if (!form.partId || !form.quantity || !form.unitCost) {
      setError("Select part, quantity and unit cost before adding item.");
      return;
    }
    const part = parts.find(p => String(p.id) === String(form.partId));
    setItems([...items, {
      partId: Number(form.partId),
      partName: part?.name || `Part ${form.partId}`,
      quantity: Number(form.quantity),
      unitCost: Number(form.unitCost),
    }]);
    setForm({ ...form, partId: "", quantity: "1", unitCost: "" });
    setError("");
  };

  const submitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (items.length === 0) {
      setError("Add at least one invoice item.");
      return;
    }
    try {
      await purchaseApi.create({
        invoiceNumber: form.invoiceNumber,
        vendorId: Number(form.vendorId),
        purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : null,
        notes: form.notes,
        items: items.map(item => ({ partId: item.partId, quantity: item.quantity, unitCost: item.unitCost })),
      });
      setMessage("Purchase invoice created and stock updated successfully.");
      setForm(emptyForm);
      setItems([]);
      setShowForm(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to create purchase invoice");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Purchase Invoices</h2>
          <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Plus size={20} /> Create Purchase Order
          </button>
        </div>

        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {loading && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">Loading...</div>}

        {showForm && (
          <form onSubmit={submitInvoice} className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Purchase Invoice</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700"><X size={22} /></button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <input required placeholder="Invoice number" value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <select required value={form.vendorId} onChange={e => setForm({ ...form, vendorId: e.target.value })} className="px-4 py-2 border rounded-lg">
                <option value="">Select vendor</option>
                {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
              </select>
              <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="md:col-span-3 px-4 py-2 border rounded-lg" />
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-3">Invoice Items</h4>
              <div className="grid md:grid-cols-4 gap-3 mb-3">
                <select value={form.partId} onChange={e => setForm({ ...form, partId: e.target.value })} className="px-4 py-2 border rounded-lg">
                  <option value="">Select part</option>
                  {parts.map(part => <option key={part.id} value={part.id}>{part.name} ({part.partNumber})</option>)}
                </select>
                <input type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="px-4 py-2 border rounded-lg" />
                <input type="number" step="0.01" placeholder="Unit cost" value={form.unitCost} onChange={e => setForm({ ...form, unitCost: e.target.value })} className="px-4 py-2 border rounded-lg" />
                <button type="button" onClick={addItem} className="bg-gray-800 text-white px-4 py-2 rounded-lg">Add Item</button>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg text-sm">
                    <span>{item.partName} × {item.quantity} @ £{item.unitCost.toFixed(2)}</span>
                    <div className="flex items-center gap-4">
                      <strong>£{(item.quantity * item.unitCost).toFixed(2)}</strong>
                      <button type="button" onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-600">Remove</button>
                    </div>
                  </div>
                ))}
                <p className="text-right font-bold">Total: £{totalItems.toFixed(2)}</p>
              </div>
            </div>

            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Create Invoice</button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.vendorName || invoice.vendorId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.purchaseDate ? new Date(invoice.purchaseDate).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.items?.length || 0}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">£{Number(invoice.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.notes || "-"}</td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No purchase invoices found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
