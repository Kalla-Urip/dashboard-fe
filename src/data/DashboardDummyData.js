// DashboardDummyData.js
// Simulasi format data dummy untuk dashboard KacabNew

export const dashboardDummyData = {
  totalRevenue: 1823000000,
  revenueThisMonth: 1823000000,
  revenueLastMonth: 1823000000,
  totalSales: 5743,
  totalTrust: 5743,
  // Data untuk chart bar revenue per bulan
  revenueByMonth: [
    { month: 'JAN', value: 180 },
    { month: 'FEB', value: 110 },
    { month: 'MAR', value: 50 },
    { month: 'APR', value: 55 },
    { month: 'MEI', value: 135 },
    { month: 'JUN', value: 180 },
    { month: 'JUL', value: 75 },
    { month: 'AGS', value: 130 },
    { month: 'SEP', value: 205 },
    { month: 'OKT', value: 220 },
    { month: 'NOV', value: 205 },
    { month: 'DES', value: 235 },
  ],
  // Tahun yang tersedia untuk dropdown
  availableYears: [2025],
  
  // Data untuk Top 5 Model
  top5Model: [
    { id: 1, name: 'New Rush 1.5 S M/T GR', value: 58, percentage: 25, color: '#00CA52' },
    { id: 2, name: 'Calya 1.2 G M/T', value: 46, percentage: 20, color: '#02BFD8' },
    { id: 3, name: 'New Rush 1.5 A/T GR', value: 46, percentage: 20, color: '#FBB040' },
    { id: 4, name: 'New Calya 1.2 G M/T', value: 46, percentage: 20, color: '#FF6C64' },
    { id: 5, name: 'New rUSH 1.5 S M/T TRD', value: 36, percentage: 15, color: '#8B5CF6' },
  ],
  totalModel: 232,
  
  // Data untuk Top 5 Sales
  top5Sales: [
    { id: 1, name: 'Rosmadina', value: 82, percentage: 35, color: '#00CA52' },
    { id: 2, name: 'Nurfadillah', value: 30, percentage: 13, color: '#02BFD8' },
    { id: 3, name: 'Stefanus Eka', value: 40, percentage: 17, color: '#FBB040' },
    { id: 4, name: 'Alifya Mentari', value: 40, percentage: 17, color: '#FF6C64' },
    { id: 5, name: 'Nurma Istika', value: 40, percentage: 17, color: '#8B5CF6' },
  ],
  totalSalesCount: 232,
  
  // Data untuk Revenue By Sales Table
  revenueBySales: [
    { no: 1, name: 'Rosmadina', revenue: 921342000 },
    { no: 2, name: 'Nurfadillah', revenue: 921342000 },
    { no: 3, name: 'Stefanus Eka', revenue: 921342000 },
    { no: 4, name: 'Alifya Mentari', revenue: 921342000 },
    { no: 5, name: 'Nurma Istika', revenue: 921342000 },
    { no: 6, name: 'Ahmad Rizki', revenue: 821342000 },
    { no: 7, name: 'Siti Nurhaliza', revenue: 721342000 },
    { no: 8, name: 'Budi Santoso', revenue: 621342000 },
    { no: 9, name: 'Maya Sari', revenue: 521342000 },
    { no: 10, name: 'Joko Widodo', revenue: 421342000 },
  ],
  
  // Bulan yang tersedia untuk dropdown
  availableMonths: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
};

// Contoh format JSON untuk backend:
// {
//   "totalRevenue": number,
//   "revenueThisMonth": number,
//   "revenueLastMonth": number,
//   "totalSales": number,
//   "totalTrust": number,
//   "revenueByMonth": [
//     { "month": "JAN", "value": number }, ...
//   ],
//   "availableYears": [number, ...]
// }
