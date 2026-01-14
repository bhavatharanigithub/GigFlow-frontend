// import React, { useEffect, useState } from "react";
// import API from "../api/axios";
// import toast, { Toaster } from "react-hot-toast";
// import socket from "../socket";
// import Navbar from "../components/Navbar";

// const FreelancerDashboard = () => {
//   const [gigs, setGigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bidMessage, setBidMessage] = useState({});
//   const [bidPrice, setBidPrice] = useState({});
//   const [submittedBids, setSubmittedBids] = useState({});
//   const [search, setSearch] = useState("");
//   const [notifications, setNotifications] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [showBidForm, setShowBidForm] = useState({});

//   /* ================= SOCKET SETUP ================= */
//   useEffect(() => {
//     const initSocket = async () => {
//       try {
//         const res = await API.get("/auth/me", { withCredentials: true });
//         const userId = res.data._id;

//         if (!userId) {
//           console.error("No user ID found");
//           return;
//         }

//         if (!socket.connected) {
//           socket.connect();
//         }
        
//         socket.emit("joinRoom", userId);

//         socket.on("hired", (data) => {
//           toast.success(data.message || "You have been hired!", {
//             duration: 5000,
//             style: {
//               background: '#10b981',
//               color: '#fff',
//             },
//           });
//           setNotifications((prev) => [data, ...prev]);
//         });

//         window.socket = socket;
//       } catch (err) {
//         console.error("Socket init failed", err);
//         toast.error("Failed to connect to real-time updates");
//       }
//     };

//     initSocket();

//     return () => {
//       socket.off("hired");
//       if (socket.connected) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   /* ================= FETCH USER & GIGS ================= */
//   useEffect(() => {
//     const fetchUserAndGigs = async () => {
//       try {
//         setLoading(true);
        
//         const userRes = await API.get("/auth/me", { withCredentials: true });
//         if (userRes.data?._id) {
//           setCurrentUserId(userRes.data._id);
//           localStorage.setItem("userId", userRes.data._id);
//         }
        
//         const res = await API.get("/gigs");
//         const gigsData = Array.isArray(res.data) ? res.data : res.data.gigs;
//         setGigs(gigsData.filter((gig) => gig.status === "open"));
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch gigs");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserAndGigs();
//   }, []);

//   /* ================= SUBMIT BID ================= */
//   const handleBid = async (gigId) => {
//     const proposal = bidMessage[gigId]?.trim();
//     const amount = Number(bidPrice[gigId]);

//     if (!proposal || !amount || amount <= 0) {
//       toast.error("Please enter a valid proposal and amount");
//       return;
//     }

//     try {
//       const res = await API.post("/bids", { gigId, message: proposal, price: amount });
//       toast.success("Bid submitted successfully!");
      
//       setBidMessage((p) => ({ ...p, [gigId]: "" }));
//       setBidPrice((p) => ({ ...p, [gigId]: "" }));
//       setSubmittedBids((p) => ({ ...p, [gigId]: true }));
//       setShowBidForm((p) => ({ ...p, [gigId]: false }));
//     } catch (err) {
//       console.error(err.response?.data || err);
//       toast.error(err.response?.data?.message || "Bid failed");
//     }
//   };

//   const filteredGigs = gigs.filter((gig) =>
//     gig.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <Toaster position="top-right" />

//         {/* Notifications Panel */}
//         {notifications.length > 0 && (
//           <div className="fixed top-24 right-6 w-80 space-y-2 z-50">
//             {notifications.slice(0, 3).map((n, i) => (
//               <div
//                 key={i}
//                 className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-xl animate-slide-in"
//               >
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-sm">{n.message}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-12">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//             <div>
//               <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
//                 Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Opportunities</span>
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 Browse quality projects and submit your proposals
//               </p>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="relative max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <input
//               type="text"
//               placeholder="Search projects by title..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//               </svg>
//               <p className="text-gray-600">Loading opportunities...</p>
//             </div>
//           </div>
//         ) : filteredGigs.length === 0 ? (
//           <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects available</h3>
//             <p className="text-gray-600">Check back later for new opportunities.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {filteredGigs.map((gig) => {
//               const isOwner = currentUserId && gig.ownerId?._id === currentUserId;
//               const hasBid = submittedBids[gig._id];
//               const showForm = showBidForm[gig._id];

//               return (
//                 <div
//                   key={gig._id}
//                   className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
//                 >
//                   <div className="p-6">
//                     {/* Header */}
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
//                           {gig.title}
//                         </h2>
//                         <p className="text-gray-600 text-sm line-clamp-3 mb-3">
//                           {gig.description}
//                         </p>
//                       </div>
//                       <span className="ml-4 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold whitespace-nowrap">
//                         OPEN
//                       </span>
//                     </div>

//                     {/* Meta Info */}
//                     <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
//                           <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                           </svg>
//                         </div>
//                         <span className="text-sm text-gray-600">{gig.ownerId?.name}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <span className="text-lg font-bold text-gray-900">₹{gig.budget.toLocaleString()}</span>
//                       </div>
//                     </div>

//                     {/* Action Section */}
//                     {isOwner ? (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
//                         <p className="text-sm text-yellow-800 font-medium">
//                           You cannot bid on your own project
//                         </p>
//                       </div>
//                     ) : hasBid ? (
//                       <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
//                         <p className="text-sm text-green-800 font-semibold flex items-center justify-center gap-2">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           Bid Submitted Successfully
//                         </p>
//                       </div>
//                     ) : (
//                       <div>
//                         {!showForm ? (
//                           <button
//                             onClick={() => setShowBidForm((p) => ({ ...p, [gig._id]: true }))}
//                             className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
//                           >
//                             Submit a Bid
//                           </button>
//                         ) : (
//                           <div className="space-y-3">
//                             <div>
//                               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Your Proposal
//                               </label>
//                               <textarea
//                                 placeholder="Describe why you're the best fit for this project..."
//                                 value={bidMessage[gig._id] || ""}
//                                 onChange={(e) =>
//                                   setBidMessage((p) => ({ ...p, [gig._id]: e.target.value }))
//                                 }
//                                 className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
//                                 rows={3}
//                               />
//                             </div>
//                             <div className="flex gap-3">
//                               <div className="flex-1">
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                   Your Price (₹)
//                                 </label>
//                                 <input
//                                   type="number"
//                                   placeholder="10000"
//                                   value={bidPrice[gig._id] || ""}
//                                   onChange={(e) =>
//                                     setBidPrice((p) => ({ ...p, [gig._id]: e.target.value }))
//                                   }
//                                   className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
//                                 />
//                               </div>
//                               <div className="flex items-end gap-2">
//                                 <button
//                                   onClick={() => {
//                                     setShowBidForm((p) => ({ ...p, [gig._id]: false }));
//                                     setBidMessage((p) => ({ ...p, [gig._id]: "" }));
//                                     setBidPrice((p) => ({ ...p, [gig._id]: "" }));
//                                   }}
//                                   className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
//                                 >
//                                   Cancel
//                                 </button>
//                                 <button
//                                   onClick={() => handleBid(gig._id)}
//                                   disabled={!bidMessage[gig._id]?.trim() || !bidPrice[gig._id] || Number(bidPrice[gig._id]) <= 0}
//                                   className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                                 >
//                                   Submit
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FreelancerDashboard;
import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import socket from "../socket";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const socketInitialized = useRef(false);

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidMessage, setBidMessage] = useState({});
  const [bidPrice, setBidPrice] = useState({});
  const [submittedBids, setSubmittedBids] = useState({});
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showBidForm, setShowBidForm] = useState({});

  /* ================= AUTH + SOCKET ================= */
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      try {
        const { data } = await API.get("/auth/me");
        setCurrentUserId(data._id);
        localStorage.setItem("userId", data._id);

        if (!socketInitialized.current) {
          socket.connect();
          socket.emit("joinRoom", data._id);

          socket.on("hired", (payload) => {
            toast.success(payload.message || "You have been hired 🎉");
            setNotifications((prev) => [payload, ...prev]);
          });

          socketInitialized.current = true;
        }
      } catch (err) {
        console.error("Auth failed", err);
        localStorage.clear();
        toast.error("Session expired. Login again.");
        navigate("/login");
      }
    };

    init();

    return () => {
      socket.off("hired");
    };
  }, [navigate]);

  /* ================= FETCH GIGS ================= */
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await API.get("/gigs");
        const list = Array.isArray(res.data) ? res.data : res.data.gigs;
        setGigs(list.filter((g) => g.status === "open"));
      } catch (err) {
        toast.error("Failed to load gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  /* ================= SUBMIT BID ================= */
  const handleBid = async (gigId) => {
    const proposal = bidMessage[gigId]?.trim();
    const amount = Number(bidPrice[gigId]);

    if (!proposal || amount <= 0) {
      toast.error("Invalid bid details");
      return;
    }

    try {
      await API.post("/bids", { gigId, message: proposal, price: amount });
      toast.success("Bid submitted!");

      setSubmittedBids((p) => ({ ...p, [gigId]: true }));
      setShowBidForm((p) => ({ ...p, [gigId]: false }));
      setBidMessage((p) => ({ ...p, [gigId]: "" }));
      setBidPrice((p) => ({ ...p, [gigId]: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Bid failed");
    }
  };

  const filteredGigs = gigs.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <input
          className="w-full mb-8 px-4 py-3 border rounded-xl"
          placeholder="Search gigs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredGigs.length === 0 ? (
          <p className="text-center">No gigs available</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGigs.map((gig) => {
              const isOwner = gig.ownerId?._id === currentUserId;
              const hasBid = submittedBids[gig._id];
              const showForm = showBidForm[gig._id];

              return (
                <div key={gig._id} className="bg-white p-6 rounded-xl shadow">
                  <h2 className="text-xl font-bold">{gig.title}</h2>
                  <p className="text-gray-600">{gig.description}</p>
                  <p className="font-semibold mt-2">₹{gig.budget}</p>

                  {isOwner ? (
                    <p className="text-yellow-600 mt-3">
                      You can’t bid on your own gig
                    </p>
                  ) : hasBid ? (
                    <p className="text-green-600 mt-3">Bid submitted</p>
                  ) : !showForm ? (
                    <button
                      className="mt-4 btn-primary"
                      onClick={() =>
                        setShowBidForm((p) => ({ ...p, [gig._id]: true }))
                      }
                    >
                      Submit Bid
                    </button>
                  ) : (
                    <>
                      <textarea
                        className="w-full mt-3 border rounded p-2"
                        placeholder="Proposal"
                        value={bidMessage[gig._id] || ""}
                        onChange={(e) =>
                          setBidMessage((p) => ({
                            ...p,
                            [gig._id]: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        className="w-full mt-2 border rounded p-2"
                        placeholder="Price"
                        value={bidPrice[gig._id] || ""}
                        onChange={(e) =>
                          setBidPrice((p) => ({
                            ...p,
                            [gig._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="mt-2 btn-primary"
                        onClick={() => handleBid(gig._id)}
                      >
                        Confirm Bid
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;

