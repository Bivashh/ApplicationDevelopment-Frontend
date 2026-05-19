import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Plus, Trash2, X } from "lucide-react";
import { authApi, staffApi } from "../../../api/client";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
  { path: "/admin/parts", label: "Parts Inventory", icon: <Package size={20} /> },
  { path: "/admin/vendors", label: "Vendors", icon: <ShoppingCart size={20} /> },
  { path: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <DollarSign size={20} /> },
  { path: "/admin/reports", label: "Financial Reports", icon: <TrendingUp size={20} /> },
];

const emptyForm = { fullName: "", email: "", password: "Staff123", phone: "", employeeCode: "" };

export function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStaff = async () => {
    setLoading(true);
    setError("");
    try {
      setStaff(await staffApi.getAll());
    } catch (err: any) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStaff(); }, []);

  const submitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await authApi.registerStaff(form);
      setMessage("Staff account created successfully.");
      setForm(emptyForm);
      setShowForm(false);
      await loadStaff();
    } catch (err: any) {
      setError(err.message || "Failed to create staff");
    }
  };

  const deleteStaff = async (id: number) => {
    if (!confirm("Delete this staff member?")) return;
    setMessage("");
    setError("");
    try {
      await staffApi.delete(id);
      setMessage("Staff deleted successfully.");
      await loadStaff();
    } catch (err: any) {
      setError(err.message || "Failed to delete staff");
    }
  };

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Staff Management</h2>
          <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Plus size={20} /> Add Staff
          </button>
        </div>

        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {loading && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">Loading...</div>}

        {showForm && (
          <form onSubmit={submitStaff} className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Staff Account</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700"><X size={22} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-4 py-2 border rounded-lg" />
              <input required placeholder="Employee code" value={form.employeeCode} onChange={e => setForm({ ...form, employeeCode: e.target.value })} className="px-4 py-2 border rounded-lg" />
            </div>
            <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Create Staff</button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hired</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.employeeCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.hiredAt ? new Date(member.hiredAt).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4 text-sm"><button onClick={() => deleteStaff(member.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button></td>
                </tr>
              ))}
              {staff.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No staff found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
