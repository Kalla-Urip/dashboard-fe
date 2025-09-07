import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router"
import MainLayout from "./layout/MainLayout"
import { AuthProvider } from "./hooks/useAuth"
import VehicleTypeIndex from "./pages/MasterData/VehicleType/Index"
import UserRoleIndex from "./pages/MasterData/UserRole/Index"
import UserRoleForm from "./pages/MasterData/UserRole/Form"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard/Index"
import WorkshopMonitorIndex from "./pages/WorkshopMonitor/Index"
import { MonitorTradeInAssignIndex } from "./pages/MonitorTradeIn/Assign/Index"
import { MonitorTradeInProgressIndex } from "./pages/MonitorTradeIn/Progress/Index"
import CrossSellingTire from "./pages/CrossSelling/Tire"
import CrossSellingBatterai from "./pages/CrossSelling/Batterai"
import CrossSellingBodyRepair from "./pages/CrossSelling/BodyRepair"
import WorkshopMonitorDetail from "./pages/WorkshopMonitor/Form"
import DataTrustIndex from "./pages/DataTrust/Index"
import DataTrustDetail from "./pages/DataTrust/Detail"
import { MonitorTradeInFinishIndex } from "./pages/MonitorTradeIn/History/Index"
import MonitorTradeInFinishDetail from "./pages/MonitorTradeIn/History/Detail"
import VehicleDataIndex from "./pages/VehicleData/Index"
import VehicleDataDetail from "./pages/VehicleData/Detail"
import VehicleDataService from "./pages/VehicleData/Service"
import DataSalesIndex from "./pages/DataSales/Index"
import DataSalesDetail from "./pages/DataSales/Detail"
import BirthDayIndex from "./pages/MonitorCR/Birthday/Index"
import CustomerRatingIndex from "./pages/CustomerRating/Index"
import StallIndex from "./pages/MasterData/Stall/Index"
import MaturityIndex from "./pages/MonitorCR/Maturity/Index"
import TestDriveVehicle from "./pages/TestDrive/VehicleList/Index"
import AppoinmentIndex from "./pages/TestDrive/Appointment/Index"
import AppoinmentHistory from "./pages/TestDrive/History"
import PeriodicServiceIndex from "./pages/MonitorCR/PeriodicService/Index"
import CustomerDataIndex from "./pages/CustomerData/Index"
import CustomerDataForm from "./pages/CustomerData/Form"
import UCareSales from "./pages/Ucare/Sales"
import UCareGeneralRepair from "./pages/Ucare/GeneralRepair"
import VehicleModelIndex from "./pages/MasterData/VehicleModel/Index"

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient} >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<ProtectedRoute><MainLayout/></ProtectedRoute>} >
              <Route index element={<Dashboard/>} />
              <Route path="u-care" >
                <Route path="sales" element={<UCareSales/>} />
                <Route path="general-repair" element={<UCareGeneralRepair/>} />
              </Route>
              <Route path="master-data" >
                <Route path="vehicle-type" element={<VehicleTypeIndex/>} />
                <Route path="vehicle-model" element={<VehicleModelIndex/>} />
                <Route path="stall" element={<StallIndex/>} />
                <Route path="user-role">
                  <Route index element={<UserRoleIndex/>} />
                  <Route path="create" element={<UserRoleForm/>} />
                  <Route path="detail/:id" element={<UserRoleForm/>} />
                </Route>
              </Route>
              <Route path="monitor-tradein" >
                <Route path="assign" element={<MonitorTradeInAssignIndex/>} />
                <Route path="progress" element={<MonitorTradeInProgressIndex/>} />
                <Route path="history">
                  <Route index element={<MonitorTradeInFinishIndex/>} />
                  <Route path="detail/:id" element={<MonitorTradeInFinishDetail/>} />
                </Route>
              </Route>
              <Route path="monitor-cr" >
                <Route path="birthday" element={<BirthDayIndex/>} />
                <Route path="maturity" element={<MaturityIndex/>} />
                <Route path="periodic-service" element={<PeriodicServiceIndex/>} />
              </Route>
              <Route path="cross-selling" >
                <Route path="tire" element={<CrossSellingTire/>} />
                <Route path="batterai" element={<CrossSellingBatterai/>} />
                <Route path="body-repair" element={<CrossSellingBodyRepair/>} />
              </Route>
              <Route path="workshop-monitor" >
                <Route index element={<WorkshopMonitorIndex/>} />
                <Route path="detail/:id" element={<WorkshopMonitorDetail/>} />
              </Route>
              <Route path="data-trust" >
                <Route index element={<DataTrustIndex/>} />
                <Route path="detail/:id" element={<DataTrustDetail/>} />
              </Route>
              <Route path="data-sales" >
                <Route index element={<DataSalesIndex/>} />
                <Route path="detail/:id" element={<DataSalesDetail/>} />
              </Route>
              <Route path="vehicle-data" >
                <Route index element={<VehicleDataIndex/>} />
                <Route path="detail/:id" element={<VehicleDataDetail/>} />
                <Route path="service/:id" element={<VehicleDataService/>} />
              </Route>
              <Route path="customer-data" >
                <Route index element={<CustomerDataIndex/>} />
                <Route path="detail/:id" element={<CustomerDataForm/>} />
              </Route>
              <Route path="test-drive" >
                <Route path="vehicle-type" index element={<TestDriveVehicle/>} />
                <Route path="appoinment" index element={<AppoinmentIndex/>} />
                <Route path="history" index element={<AppoinmentHistory/>} />
              </Route>
              <Route path="customer-rating" >
                <Route index element={<CustomerRatingIndex/>} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
