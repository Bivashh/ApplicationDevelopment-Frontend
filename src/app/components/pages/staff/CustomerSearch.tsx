import { useState } from "react";
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

export function CustomerSearch() {
  const [query, setQuery] = useState({ name: "", phone: "", email: "", vehiclePlate: "", customerId: "" });
  const [customers, setCustomers] = useState<any[]>([]);
  const [error, setError] = useState("");

  const searchCustomers = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name: query.name || null,
        phone: query.phone || null,
        email: query.email || null,
        vehiclePlate: query.vehiclePlate || null,
        customerId: query.customerId ? Number(query.customerId) : null,
      };
      setCustomers(await customersApi.search(payload));
    } catch (err: any) {
      setError(err.message || "Search failed. Backend currently authorizes this endpoint for Admin only.");
    }
  };

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Search</h2>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        <form onSubmit={searchCustomers} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <input placeholder="Name" value={query.name} onChange={e => setQuery({ ...query, name: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Phone" value={query.phone} onChange={e => setQuery({ ...query, phone: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Email" value={query.email} onChange={e => setQuery({ ...query, email: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Vehicle plate" value={query.vehiclePlate} onChange={e => setQuery({ ...query, vehiclePlate: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="number" placeholder="Customer ID" value={query.customerId} onChange={e => setQuery({ ...query, customerId: e.target.value })} className="px-4 py-2 border rounded-lg" />
          </div>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">Search</button>
        </form>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left">ID</th><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Phone</th><th className="px-6 py-3 text-left">Spent</th></tr></thead>
          <tbody className="divide-y">{customers.map(c => <tr key={c.id || c.customerId}><td className="px-6 py-4">{c.id || c.customerId}</td><td className="px-6 py-4">{c.fullName}</td><td className="px-6 py-4">{c.email}</td><td className="px-6 py-4">{c.phone}</td><td className="px-6 py-4">£{Number(c.totalSpent || 0).toFixed(2)}</td></tr>)}{customers.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No customers to show.</td></tr>}</tbody></table>
        </div>
      </div>
    </DashboardLayout>
  );
}
