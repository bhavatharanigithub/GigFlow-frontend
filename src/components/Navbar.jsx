// import React, { useState, useEffect } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import API from "../api/axios";
// import toast from "react-hot-toast";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await API.get("/auth/me", { withCredentials: true });
//         setUser(res.data);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [location]);

//   const handleLogout = async () => {
//     try {
//       await API.post("/auth/logout", {}, { withCredentials: true });
//       localStorage.removeItem("userId");
//       localStorage.removeItem("userName");
//       localStorage.removeItem("userEmail");
//       setUser(null);
//       setShowDropdown(false);
//       toast.success("Logged out successfully");
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       localStorage.removeItem("userId");
//       localStorage.removeItem("userName");
//       localStorage.removeItem("userEmail");
//       setUser(null);
//       navigate("/");
//     }
//   };

//   if (loading) return null;

//   return (
//     <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 group">
//             <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               GigFlow
//             </span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="flex items-center gap-6">
//             {user ? (
//               <>
//                 <Link
//                   to="/freelancer-dashboard"
//                   className={`hidden md:block px-4 py-2 rounded-lg font-medium transition-all ${
//                     location.pathname === "/freelancer-dashboard"
//                       ? "text-indigo-600 bg-indigo-50"
//                       : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   Browse Gigs
//                 </Link>
//                 <Link
//                   to="/client-dashboard"
//                   className={`hidden md:block px-4 py-2 rounded-lg font-medium transition-all ${
//                     location.pathname === "/client-dashboard"
//                       ? "text-indigo-600 bg-indigo-50"
//                       : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   My Projects
//                 </Link>
                
//                 {/* User Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowDropdown(!showDropdown)}
//                     className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all border border-indigo-200"
//                   >
//                     <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                       {user.name?.charAt(0).toUpperCase()}
//                     </div>
//                     <span className="hidden md:block text-sm font-semibold text-gray-700">
//                       {user.name}
//                     </span>
//                     <svg className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
                  
//                   {showDropdown && (
//                     <>
//                       <div 
//                         className="fixed inset-0 z-10" 
//                         onClick={() => setShowDropdown(false)}
//                       ></div>
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
//                         <div className="px-4 py-2 border-b border-gray-200">
//                           <p className="text-sm font-semibold text-gray-900">{user.name}</p>
//                           <p className="text-xs text-gray-500">{user.email}</p>
//                         </div>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                           </svg>
//                           Logout
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // ✅ VERY IMPORTANT: do NOT call /auth/me without token
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location.pathname]); // re-check only on route change

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setUser(null);
    setShowDropdown(false);

    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-2xl font-bold text-indigo-600">GigFlow</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/freelancer-dashboard" className="text-gray-700 hover:text-indigo-600">
                  Browse Gigs
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50"
                  >
                    <span className="font-semibold">
                      {user.name}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
