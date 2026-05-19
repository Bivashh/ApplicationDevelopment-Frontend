import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Plus, Edit, Trash2, X } from "lucide-react";
import { vendorsApi } from "../../../api/client";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
  { path: "/admin/parts", label: "Parts Inventory", icon: <Package size={20} /> },
  { path: "/admin/vendors", label: "Vendors", icon: <ShoppingCart size={20} /> },
  { path: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <DollarSign size={20} /> },
  { path: "/admin/reports", label: "Financial Reports", icon: <TrendingUp size={20} /> },
];

const emptyForm = { name: "", contactPerson: "", phoneNumber: "", email: "", address: "" };

export function VendorManagement() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadVendors = async () => {
    setLoading(true);
    setError("");
    try {
      setVendors(await vendorsApi.getAll());
    } catch (err: any) {
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVendors(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const submitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editingId) {
        await vendorsApi.update(editingId, form);
        setMessage("Vendor updated successfully.");
      } else {
        await vendorsApi.create(form);
        setMessage("Vendor created successfully.");
      }
      resetForm();
      await loadVendors();
    } catch (err: any) {
      setError(err.message || "Failed to save vendor");
    }
  };

  const editVendor = (vendor: any) => {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name || "",
      contactPerson: vendor.contactPerson || "",
      phoneNumber: vendor.phoneNumber || "",
      email: vendor.email || "",
      address: vendor.address || "",
    });
    setShowForm(true);
  };

  const deleteVendor = async (id: number) => {
    if (!confirm("Delete this vendor?")) return;
    setMessage("");
    setError("");
    try {
      await vendorsApi.delete(id);
      setMessage("Vendor deleted successfully.");
      await loadVendors();
    } catch (err: any) {
      setError(err.message || "Failed to delete vendor");
    }
  };

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Vendor Management</h2>
          <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Plus size={20} /> Add New Vendor
          </button>
        </div>

        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {loading && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">Loading...</div>}

        {showForm && (
          <form onSubmit={submitVendor} className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Vendor" : "Add Vendor"}</h3>
              <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X size={22} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Vendor name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Contact person" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Phone number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <textarea placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="md:col-span-2 px-4 py-2 border rounded-lg" />
            </div>
            <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">{editingId ? "Update Vendor" : "Create Vendor"}</button>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {vendors.map(vendor => (
            <div key={vendor.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                  <p className="text-sm text-gray-500">ID: {vendor.id}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => editVendor(vendor)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                  <button onClick={() => deleteVendor(vendor.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Contact:</strong> {vendor.contactPerson || "-"}</p>
                <p><strong>Email:</strong> {vendor.email || "-"}</p>
                <p><strong>Phone:</strong> {vendor.phoneNumber || "-"}</p>
                <p><strong>Address:</strong> {vendor.address || "-"}</p>
                <p><strong>Status:</strong> {vendor.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          ))}
          {vendors.length === 0 && <div className="bg-white rounded-lg shadow p-8 text-gray-500">No vendors found.</div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
