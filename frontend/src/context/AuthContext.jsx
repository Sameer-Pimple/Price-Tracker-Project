import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const [accessToken, setAccessToken] = useState(null);
   // 1. Naya loading state set kiya (Default: true)
   const [loading, setLoading] = useState(true);

   // 2. Page refresh hote hi chalne wala automatic background check
   useEffect(() => {
      const checkExistingSession = async () => {
         try{
             const data = await api.refreshToken();
               if (data && data.AccessToken) {
                  setAccessToken(data.AccessToken);
               }
         } catch (error) {
//             console.error("Silent refresh check failed:", error);
         } finally {
            // Check poora hote hi loading band chahe token mile ya error aaye
            setLoading(false);
         }
      };

      checkExistingSession();
   }, []);

   const login = (token) => {
     setAccessToken(token);
   };

   const logout = () => {
       setAccessToken(null);
   };

   return (
      <AuthContext.Provider
         value={{
            accessToken,
            login,
            logout
         }}
      >
         {/* 3. FIX: Jab tak loading check chal raha hai, tab tak children ko render mat karo,
             ek pyara sa message ya spinner dikhao taaki UI 'Login/Signup' par jhatka na maare */}
         {!loading ? (
            children
         ) : (
            <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               height: '100vh',
               fontFamily: 'sans-serif',
               color: '#555'
            }}>
               Loading Session...
            </div>
         )}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);