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
