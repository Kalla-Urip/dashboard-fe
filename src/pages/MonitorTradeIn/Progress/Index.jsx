import { useAuth } from "../../../hooks/useAuth";
import { KacabUI } from "./Kacab";
import { SpvSalesUI } from "./SpvSales";
import { SpvTrustUI } from "./SpvTrust";

export function MonitorTradeInProgressIndex(){

  const { user } = useAuth()

  if(user?.user?.employeeType == 'Super Admin'){
    return <KacabUI/>
  }

  if(user?.user?.employeeType == 'SPV Trust'){
    return <SpvTrustUI/>
  }

  if(user?.user?.employeeType == 'SPV Sales'){
    return <SpvSalesUI/>
  }
}