import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children }:any) => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate()
  
    if (loading) return <p>Loading...</p>; 
    if (!user){
        navigate("/login")
    } 
  
    return children;
  };
  
  export default ProtectedRoute;