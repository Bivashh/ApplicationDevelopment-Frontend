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

export function PartsSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [partId, setPartId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [items, setItems] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSales = async () => {
    try { setSales(await salesApi.getAll()); } catch (err: any) { setError(err.message || "Failed to load sales"); }
  };

  useEffect(() => { loadSales(); }, []);

  const addItem = () => {
    if (!partId || !quantity) return;
    setItems([...items, { partId: Number(partId), quantity: Number(quantity) }]);
    setPartId("");
    setQuantity("1");
  };

  const createSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }
    try {
      await salesApi.create({ customerId: Number(customerId), paymentStatus, items });
      setMessage("Sales invoice created successfully and stock reduced.");
      setCustomerId("");
      setItems([]);
      await loadSales();
    } catch (err: any) {
      setError(err.message || "Failed to create sales invoice");
    }
  };

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Parts Sales</h2>
        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <form onSubmit={createSale} className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Create Sales Invoice</h3>
          <p className="text-sm text-gray-500 mb-4">Enter Customer ID and Part ID from the backend database. Sales endpoint is connected to <strong>/api/sales-invoices</strong>.</p>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input required type="number" placeholder="Customer ID" value={customerId} onChange={e => setCustomerId(e.target.value)} className="px-4 py-2 border rounded-lg" />
            <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option>Paid</option>
              <option>Pending</option>
              <option>Credit</option>
            </select>
            <input type="number" placeholder="Part ID" value={partId} onChange={e => setPartId(e.target.value)} className="px-4 py-2 border rounded-lg" />
            <input type="number" min="1" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="px-4 py-2 border rounded-lg" />
          </div>
          <button type="button" onClick={addItem} className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-3">Add Item</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create Sale</button>
          <div className="mt-4 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between">
                <span>Part ID {item.partId} × {item.quantity}</span>
                <button type="button" onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-600">Remove</button>
              </div>
            ))}
          </div>
        </form>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left">Invoice</th><th className="px-6 py-3 text-left">Customer</th><th className="px-6 py-3 text-left">Date</th><th className="px-6 py-3 text-left">Total</th><th className="px-6 py-3 text-left">Status</th></tr></thead>
            <tbody className="divide-y">
              {sales.map(invoice => (
                <tr key={invoice.invoiceId || invoice.id}><td className="px-6 py-4">#{invoice.invoiceId || invoice.id}</td><td className="px-6 py-4">{invoice.customerId}</td><td className="px-6 py-4">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : "-"}</td><td className="px-6 py-4">£{Number(invoice.totalAmount || 0).toFixed(2)}</td><td className="px-6 py-4">{invoice.paymentStatus}</td></tr>
              ))}
              {sales.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No sales found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
