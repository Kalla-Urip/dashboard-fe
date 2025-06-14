import { useAuth } from "../../hooks/useAuth"
import KacabUI from "./Kacab";
import MechanicDashboard from "./Mechanic";

export default function Dashboard(){

  const { user } = useAuth()

  switch (user?.user?.employeeType) {
    case 'Bengkel':
      return <MechanicDashboard/>
    default:
      return <KacabUI/>
  }
}