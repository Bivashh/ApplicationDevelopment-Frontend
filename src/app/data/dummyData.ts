export const dummyStaff = [
  { id: 'S001', name: 'John Smith', email: 'john@vps.com', phone: '555-0101', role: 'Sales Staff', joinDate: '2024-01-15' },
  { id: 'S002', name: 'Sarah Johnson', email: 'sarah@vps.com', phone: '555-0102', role: 'Sales Staff', joinDate: '2024-02-20' },
  { id: 'S003', name: 'Mike Davis', email: 'mike@vps.com', phone: '555-0103', role: 'Inventory Manager', joinDate: '2023-11-10' },
];

export const dummyParts = [
  { id: 'P001', name: 'Brake Pads', category: 'Brakes', brand: 'Bosch', quantity: 45, price: 89.99, reorderLevel: 10, vendor: 'V001' },
  { id: 'P002', name: 'Oil Filter', category: 'Engine', brand: 'Mann', quantity: 8, price: 12.50, reorderLevel: 10, vendor: 'V001' },
  { id: 'P003', name: 'Air Filter', category: 'Engine', brand: 'K&N', quantity: 32, price: 24.99, reorderLevel: 10, vendor: 'V002' },
  { id: 'P004', name: 'Spark Plugs (Set)', category: 'Engine', brand: 'NGK', quantity: 67, price: 45.00, reorderLevel: 10, vendor: 'V003' },
  { id: 'P005', name: 'Wiper Blades', category: 'Accessories', brand: 'Rain-X', quantity: 5, price: 19.99, reorderLevel: 10, vendor: 'V002' },
];

export const dummyVendors = [
  { id: 'V001', name: 'AutoParts Wholesale Inc.', contact: 'James Brown', email: 'james@autoparts.com', phone: '555-1001', address: '123 Industrial Blvd' },
  { id: 'V002', name: 'Premium Parts Supply', contact: 'Lisa Chen', email: 'lisa@premiumparts.com', phone: '555-1002', address: '456 Commerce St' },
  { id: 'V003', name: 'Global Auto Distributors', contact: 'Robert Lee', email: 'robert@globalauto.com', phone: '555-1003', address: '789 Trade Ave' },
];

export const dummyCustomers = [
  {
    id: 'C001',
    name: 'Alice Williams',
    email: 'alice@email.com',
    phone: '555-2001',
    address: '321 Oak Street',
    vehicles: [{ id: 'V-001', make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-1234', vin: '1HGCM82633A123456' }],
    totalSpent: 3450.00,
    creditBalance: 0,
    joinDate: '2025-03-15'
  },
  {
    id: 'C002',
    name: 'Bob Martinez',
    email: 'bob@email.com',
    phone: '555-2002',
    address: '654 Pine Avenue',
    vehicles: [{ id: 'V-002', make: 'Honda', model: 'Accord', year: 2019, licensePlate: 'XYZ-5678', vin: '1HGCM82633A789012' }],
    totalSpent: 7890.00,
    creditBalance: 0,
    joinDate: '2024-11-20'
  },
  {
    id: 'C003',
    name: 'Carol Anderson',
    email: 'carol@email.com',
    phone: '555-2003',
    address: '987 Elm Road',
    vehicles: [
      { id: 'V-003', make: 'Ford', model: 'F-150', year: 2021, licensePlate: 'DEF-9012', vin: '1FTFW1E85BFA12345' },
      { id: 'V-004', make: 'BMW', model: 'X5', year: 2022, licensePlate: 'GHI-3456', vin: '5UXCR6C09M9A67890' }
    ],
    totalSpent: 12450.00,
    creditBalance: 350.00,
    joinDate: '2024-06-10'
  },
  {
    id: 'C004',
    name: 'David Thompson',
    email: 'david@email.com',
    phone: '555-2004',
    address: '147 Maple Lane',
    vehicles: [{ id: 'V-005', make: 'Chevrolet', model: 'Silverado', year: 2018, licensePlate: 'JKL-7890', vin: '3GCUKREC5JG123456' }],
    totalSpent: 1230.00,
    creditBalance: 450.00,
    joinDate: '2025-01-05'
  },
];

export const dummySales = [
  { id: 'INV-1001', date: '2026-04-25', customer: 'C001', items: [{ partId: 'P001', quantity: 2, price: 89.99 }], total: 179.98, status: 'Paid', staff: 'S001' },
  { id: 'INV-1002', date: '2026-04-24', customer: 'C002', items: [{ partId: 'P003', quantity: 1, price: 24.99 }, { partId: 'P004', quantity: 2, price: 45.00 }], total: 114.99, status: 'Paid', staff: 'S002' },
  { id: 'INV-1003', date: '2026-04-23', customer: 'C003', items: [{ partId: 'P001', quantity: 4, price: 89.99 }], total: 359.96, status: 'Credit', staff: 'S001' },
  { id: 'INV-1004', date: '2026-04-22', customer: 'C002', items: [{ partId: 'P002', quantity: 3, price: 12.50 }], total: 37.50, status: 'Paid', staff: 'S002' },
  { id: 'INV-1005', date: '2026-04-20', customer: 'C004', items: [{ partId: 'P005', quantity: 2, price: 19.99 }], total: 39.98, status: 'Credit', staff: 'S001' },
];

export const dummyPurchases = [
  { id: 'PO-501', date: '2026-04-20', vendor: 'V001', items: [{ partId: 'P001', quantity: 50, unitCost: 65.00 }], total: 3250.00, status: 'Received' },
  { id: 'PO-502', date: '2026-04-18', vendor: 'V002', items: [{ partId: 'P003', quantity: 30, unitCost: 18.00 }], total: 540.00, status: 'Received' },
  { id: 'PO-503', date: '2026-04-15', vendor: 'V003', items: [{ partId: 'P004', quantity: 100, unitCost: 32.00 }], total: 3200.00, status: 'Pending' },
];

export const dummyAppointments = [
  { id: 'APT-301', customer: 'C001', vehicle: 'V-001', date: '2026-04-28', time: '10:00 AM', service: 'Oil Change', status: 'Scheduled' },
  { id: 'APT-302', customer: 'C002', vehicle: 'V-002', date: '2026-04-29', time: '2:00 PM', service: 'Brake Inspection', status: 'Scheduled' },
  { id: 'APT-303', customer: 'C003', vehicle: 'V-003', date: '2026-04-30', time: '9:00 AM', service: 'General Service', status: 'Scheduled' },
];

export const dummyReviews = [
  { id: 'R001', customer: 'C001', rating: 5, comment: 'Excellent service! Very professional and quick.', date: '2026-04-20' },
  { id: 'R002', customer: 'C002', rating: 4, comment: 'Good parts quality and helpful staff.', date: '2026-04-18' },
  { id: 'R003', customer: 'C003', rating: 5, comment: 'Always my go-to place for vehicle parts!', date: '2026-04-15' },
];

export const dummyPartRequests = [
  { id: 'REQ-201', customer: 'C004', partName: 'Transmission Filter', description: 'For 2018 Chevrolet Silverado', date: '2026-04-26', status: 'Pending' },
  { id: 'REQ-202', customer: 'C001', partName: 'Headlight Assembly', description: 'Left side for 2020 Toyota Camry', date: '2026-04-25', status: 'Ordered' },
];

export const dummyFinancialData = {
  daily: { date: '2026-04-27', sales: 1250.00, purchases: 0, profit: 375.00, transactions: 8 },
  monthly: { month: 'April 2026', sales: 28450.00, purchases: 12500.00, profit: 7890.00, transactions: 156 },
  yearly: { year: '2026', sales: 125000.00, purchases: 58000.00, profit: 35000.00, transactions: 642 }
};
