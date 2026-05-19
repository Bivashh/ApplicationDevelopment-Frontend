import { useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { UserPlus, ShoppingCart, Search, FileText, TrendingUp, Package, Calendar, Star } from "lucide-react";
import { staffApi } from "../../../api/client";

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

const emptyForm = { fullName: "", email: "", password: "Customer123", phone: "", address: "", plateNumber: "", make: "", model: "", year: "", notes: "" };

export function CustomerRegistration() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await staffApi.registerCustomerWithVehicle({ ...form, year: Number(form.year) });
      setMessage("Customer and vehicle registered successfully.");
      setForm(emptyForm);
    } catch (err: any) {
      setError(err.message || "Failed to register customer");
    }
  };

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Register Customer with Vehicle</h2>
        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        <form onSubmit={submit} className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-bold mb-4">Customer Details</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <input required placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="px-4 py-3 border rounded-lg md:col-span-2" />
          </div>
          <h3 className="text-xl font-bold mb-4">Vehicle Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input required placeholder="Plate number" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required placeholder="Make" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <input required type="number" placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="px-4 py-3 border rounded-lg" />
            <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="px-4 py-3 border rounded-lg md:col-span-2" />
          </div>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Register Customer</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
