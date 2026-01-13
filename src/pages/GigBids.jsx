import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

const GigBids = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [bids, setBids] = useState([]);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiringId, setHiringId] = useState(null);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bids/${gigId}`, {
        withCredentials: true,
      });
      setBids(res.data);
      
      // Fetch gig details
      const gigRes = await API.get("/gigs");
      const gigsData = Array.isArray(gigRes.data) ? gigRes.data : gigRes.data?.gigs || [];
      const currentGig = gigsData.find((g) => g._id === gigId);
      setGig(currentGig);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [gigId]);

  const handleHire = async (bidId) => {
    if (!window.confirm("Are you sure you want to hire this freelancer? This action cannot be undone.")) {
      return;
    }

    try {
      setHiringId(bidId);

      await API.patch(
        `/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );

      toast.success("Freelancer hired successfully!", {
        duration: 5000,
      });
      fetchBids();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to hire freelancer");
    } finally {
      setHiringId(null);
    }
  };

  const pendingBids = bids.filter((b) => b.status === "pending");
  const hiredBids = bids.filter((b) => b.status === "hired");
  const rejectedBids = bids.filter((b) => b.status === "rejected");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          {gig && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
              <p className="text-gray-600 mb-4">{gig.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-bold text-gray-900">₹{gig.budget.toLocaleString()}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  gig.status === "open" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {gig.status.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingBids.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Hired</p>
              <p className="text-2xl font-bold text-green-600">{hiredBids.length}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">Loading bids...</p>
            </div>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bids received yet</h3>
            <p className="text-gray-600">Freelancers will start bidding soon. Check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending Bids First */}
            {pendingBids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {bid.freelancerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {bid.freelancerId?.name}
                        </h2>
                        <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{bid.message}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold whitespace-nowrap">
                    PENDING
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xl font-bold text-gray-900">₹{bid.price.toLocaleString()}</span>
                  </div>

                  <button
                    disabled={hiringId === bid._id || gig?.status === "assigned"}
                    onClick={() => handleHire(bid._id)}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {hiringId === bid._id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Hiring...
                      </span>
                    ) : (
                      "Hire Freelancer"
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Hired Bid */}
            {hiredBids.map((bid) => (
              <div
                key={bid._id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {bid.freelancerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {bid.freelancerId?.name}
                        </h2>
                        <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{bid.message}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    HIRED
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <span className="text-lg font-bold text-gray-900">₹{bid.price.toLocaleString()}</span>
                </div>
              </div>
            ))}

            {/* Rejected Bids */}
            {rejectedBids.map((bid) => (
              <div
                key={bid._id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 opacity-60"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        {bid.freelancerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-600">
                          {bid.freelancerId?.name}
                        </h2>
                        <p className="text-sm text-gray-400">{bid.freelancerId?.email}</p>
                      </div>
                    </div>
                    <p className="text-gray-500 mt-3">{bid.message}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold whitespace-nowrap">
                    REJECTED
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-500">₹{bid.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigBids;
