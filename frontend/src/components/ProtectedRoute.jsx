import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

function ProtectedRoute({children})
{
    const [isAuthenticated , setIsAuthenticated] = useState(false)
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
        async function checkAuth()
        {
            try{        
                await api.get("/auth/me")
                setIsAuthenticated(true)
            }
            catch(error)
            {
                console.error(error)
                setIsAuthenticated(false)
            }
            finally
            {
                setLoading(false)
            }
        }

        checkAuth()
    }, []);

    if (loading)
    {
        return <h2>loading...</h2>
    }
    if (isAuthenticated)
    {
        return children
    }
    return <Navigate to="/" replace />;
}

export default ProtectedRoute;