"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Building2, 
  MessageSquareCode, 
  Calendar, 
  Search, 
  Settings2, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  X,
  QrCode,
  Download,
  Power
} from "lucide-react";
import QRCode from "qrcode";
import { getDB } from "@/lib/db";

interface Subscription {
  plan: "Free" | "Starter" | "Professional" | "Enterprise" | "Smart AI-Review" | "WhatsApp Chatbot" | "AI Telecalling";
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Cancelled";
}

interface ClientUser {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  role: string;
  subscription: Subscription;
  createdAt: string;
}

interface Location {
  _id: string;
  name: string;
  googleReviewUrl: string;
  yelpReviewUrl?: string;
  userId?: {
    name: string;
    email: string;
    companyName: string;
  };
  isActive?: boolean;
  createdAt: string;
}

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: string;
  businessId?: {
    name: string;
    userId?: {
      name: string;
      email: string;
      companyName: string;
    };
  };
  createdAt: string;
}

const generateRealQrMatrix = (bizId?: string) => {
  const url = bizId ? `${process.env.NEXT_PUBLIC_API_URL}/api/qr/${bizId}/scan` : "http://intuik.com";
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size;
  const matrix: number[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      row.push(qr.modules.data[y * size + x]);
    }
    matrix.push(row);
  }
  return matrix;
};
//http://localhost:5000/api/qr/${bizId}/scan
export default function SuperOwnerDashboard() {
  const [activeTab, setActiveTab] = useState<"clients" | "locations" | "reviews">("clients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // QR state
  const [selectedLocationForQr, setSelectedLocationForQr] = useState<Location | null>(null);
  const [qrMatrix, setQrMatrix] = useState<number[][]>([]);
  
  // Data lists
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Search terms
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientUser | null>(null);
  const [editPlan, setEditPlan] = useState<Subscription["plan"]>("Free");
  const [editStatus, setEditStatus] = useState<Subscription["status"]>("Active");
  const [editEndDate, setEditEndDate] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);

  // Create Client Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newPlan, setNewPlan] = useState<Subscription["plan"]>("Smart AI-Review");
  const [newStatus, setNewStatus] = useState<Subscription["status"]>("Active");
  const [newEndDate, setNewEndDate] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    companyName: string;
  } | null>(null);

  // Load all lists
  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Clients
      const clientsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, {
        credentials: "include",
      });
      // 2. Fetch Locations
      const locationsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/admin/all`, {
        credentials: "include",
      });
      // 3. Fetch Reviews
      const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/admin/all`, {
        credentials: "include",
      });

      if (clientsRes.ok && locationsRes.ok && reviewsRes.ok) {
        const clientsData = await clientsRes.json();
        const locationsData = await locationsRes.json();
        const reviewsData = await reviewsRes.json();

        setClients(clientsData.filter((u: any) => u.role !== "admin")); // Only show actual clients
        setLocations(locationsData);
        setReviews(reviewsData);
      } else {
        setError("Could not load backend data. Please verify your MongoDB server connection.");
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to communicate with API server. Please make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      if (db.user.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }
    } else {
      window.location.href = "/login";
      return;
    }
    loadAllData();
  }, []);

  useEffect(() => {
    if (selectedLocationForQr) {
      setQrMatrix(generateRealQrMatrix(selectedLocationForQr._id));
    } else {
      setQrMatrix([]);
    }
  }, [selectedLocationForQr]);

  // Calculate Days Remaining
  const getRemainingDays = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "Smart AI-Review": return 4999;
      case "WhatsApp Chatbot": return 9999;
      case "AI Telecalling": return 14999;
      // Keep old ones for legacy calculations if any exist
      case "Starter": return 799;
      case "Professional": return 1599;
      case "Enterprise": return 4999;
      default: return 0;
    }
  };

  // Calculate ARR
  const calculateARR = () => {
    return clients.reduce((acc, user) => {
      if (user.subscription.status === "Active") {
        return acc + getPlanPrice(user.subscription.plan);
      }
      return acc;
    }, 0);
  };

  // Open Edit Dialog
  const openEditModal = (client: ClientUser) => {
    setSelectedClient(client);
    setEditPlan(client.subscription.plan);
    setEditStatus(client.subscription.status);
    
    // Format date string for HTML date input: YYYY-MM-DD
    const date = new Date(client.subscription.endDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    setEditEndDate(`${yyyy}-${mm}-${dd}`);
    
    setIsEditModalOpen(true);
  };

  // Submit Subscription Change
  const handleSaveSubscription = async () => {
    if (!selectedClient) return;
    setSavingPlan(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${selectedClient._id}/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: editPlan,
          status: editStatus,
          endDate: new Date(editEndDate).toISOString(),
        }),
        credentials: "include",
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        loadAllData();
      } else {
        alert("Failed to update subscription settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating client plan.");
    } finally {
      setSavingPlan(false);
    }
  };

  // Submit Direct Client User Creation
  const handleCreateClient = async () => {
    if (!newName || !newEmail || !newPassword || !newCompanyName) {
      alert("Please fill in all required fields: Name, Email, Password, Company Name");
      return;
    }
    setCreatingClient(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          companyName: newCompanyName,
          plan: newPlan,
          status: newStatus,
          endDate: new Date(newEndDate).toISOString(),
        }),
        credentials: "include",
      });

      if (res.ok) {
        setCreatedCredentials({
          email: newEmail,
          password: newPassword,
          companyName: newCompanyName,
        });
        setIsCreateModalOpen(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewCompanyName("");
        setNewPlan("Smart AI-Review");
        setNewStatus("Active");
        loadAllData();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to create client user account.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error creating client user.");
    } finally {
      setCreatingClient(false);
    }
  };

  // Delete Business Location
  const handleDeleteLocation = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete the business location "${name}"? This will also remove its associated reviews.`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        loadAllData();
      } else {
        alert("Failed to delete business location.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting location.");
    }
  };

  // Toggle Business Location Status (Deactivate / Activate)
  const handleToggleLocationStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const actionText = nextStatus ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${actionText} this business location?`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/admin/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: nextStatus }),
        credentials: "include",
      });
      if (res.ok) {
        loadAllData();
      } else {
        alert(`Failed to ${actionText} business location.`);
      }
    } catch (err) {
      console.error(err);
      alert(`Network error changing location status.`);
    }
  };

  // Delete Customer Review
  const handleDeleteReview = async (id: string, customer: string) => {
    if (!window.confirm(`Delete review from "${customer}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        loadAllData();
      } else {
        alert("Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting review.");
    }
  };

  // Filter lists based on Search Query
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.userId?.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReviews = reviews.filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.businessId?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#283570] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2E9E9C]" />
            <span>Website Owner Panel (Super Admin)</span>
          </h2>
          <p className="text-xs text-[#6B6B6B] font-semibold mt-1 font-sans">
            Manage your customer accounts, verify subscription payments, and clean up the database.
          </p>
        </div>

        <button
          onClick={loadAllData}
          disabled={loading}
          className="bg-white border border-[#E2DDD1] text-[#283570] hover:bg-[#FFFFFF] hover:text-[#2E9E9C] text-xs font-serif font-bold px-4 py-2.5 rounded-[6px] transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#2E9E9C] ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-[6px] p-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold font-serif">Database Access Error</p>
            <p className="mt-0.5 font-sans">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Clients */}
        <div className="bg-white border border-[#E2DDD1] rounded-[6px] p-6 shadow-sm flex items-center gap-4">
          <div className="bg-[#2E9E9C]/15 p-3 rounded-[6px] text-[#283570]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Total Companies</p>
            <p className="text-2xl font-serif font-bold text-[#283570] mt-0.5">{clients.length}</p>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white border border-[#E2DDD1] rounded-[6px] p-6 shadow-sm flex items-center gap-4">
          <div className="bg-[#2E9E9C]/15 p-3 rounded-[6px] text-[#283570]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Active Plans</p>
            <p className="text-2xl font-serif font-bold text-[#283570] mt-0.5">
              {clients.filter(c => c.subscription.status === "Active" && c.subscription.plan !== "Free").length}
            </p>
          </div>
        </div>

        {/* ARR estimate */}
        <div className="bg-white border border-[#E2DDD1] rounded-[6px] p-6 shadow-sm flex items-center gap-4">
          <div className="bg-[#2E9E9C]/15 p-3 rounded-[6px] text-[#283570]">
            <span className="text-lg font-bold font-mono">₹</span>
          </div>
          <div>
            <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Estimated ARR</p>
            <p className="text-2xl font-serif font-bold text-[#283570] mt-0.5">₹{calculateARR()}/yr</p>
          </div>
        </div>

        {/* Total Locations */}
        <div className="bg-white border border-[#E2DDD1] rounded-[6px] p-6 shadow-sm flex items-center gap-4">
          <div className="bg-[#2E9E9C]/15 p-3 rounded-[6px] text-[#283570]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Live Locations</p>
            <p className="text-2xl font-serif font-bold text-[#283570] mt-0.5">{locations.length}</p>
          </div>
        </div>

      </div>

      {/* Tabs list & search bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#E2DDD1] pb-2">
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => { setActiveTab("clients"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-serif font-bold rounded-[6px] transition-all ${
              activeTab === "clients" 
                ? "bg-[#283570] text-[#2E9E9C] border border-[#2E9E9C]/25" 
                : "bg-white border border-[#E2DDD1] text-[#6B6B6B] hover:bg-[#FFFFFF]"
            }`}
          >
            👥 Clients & Subscriptions ({filteredClients.length})
          </button>
          
          {activeTab === "clients" && (
            <button
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 30);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                setNewEndDate(`${yyyy}-${mm}-${dd}`);
                setIsCreateModalOpen(true);
              }}
              className="bg-[#2E9E9C] hover:bg-[#283570] text-[#283570] hover:text-[#2E9E9C] border border-[#2E9E9C] text-xs font-serif font-bold px-4 py-2 rounded-[6px] transition-all flex items-center gap-1.5"
            >
              <span>+ Create Client Account</span>
            </button>
          )}
          
          <button
            onClick={() => { setActiveTab("locations"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-serif font-bold rounded-[6px] transition-all ${
              activeTab === "locations" 
                ? "bg-[#283570] text-[#2E9E9C] border border-[#2E9E9C]/25" 
                : "bg-white border border-[#E2DDD1] text-[#6B6B6B] hover:bg-[#FFFFFF]"
            }`}
          >
            🏢 Locations DB ({filteredLocations.length})
          </button>

          <button
            onClick={() => { setActiveTab("reviews"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-serif font-bold rounded-[6px] transition-all ${
              activeTab === "reviews" 
                ? "bg-[#283570] text-[#2E9E9C] border border-[#2E9E9C]/25" 
                : "bg-white border border-[#E2DDD1] text-[#6B6B6B] hover:bg-[#FFFFFF]"
            }`}
          >
            💬 Feedbacks DB ({filteredReviews.length})
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] pl-9 pr-4 py-2 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] focus:ring-2 focus:ring-[#2E9E9C] font-semibold placeholder:text-[#6B6B6B]"
          />
        </div>
      </div>

      {/* Main lists */}
      {loading ? (
        <div className="bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] p-16 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#2E9E9C] animate-spin mx-auto mb-4" />
          <p className="text-xs text-[#6B6B6B] font-bold">Querying MongoDB Server Database...</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2DDD1] rounded-[6px] overflow-hidden shadow-sm">
          
          {/* TAB 1: Clients & Subscriptions */}
          {activeTab === "clients" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFFFF] border-b border-[#E2DDD1] text-[10px] font-serif font-bold uppercase text-[#283570] tracking-wider">
                    <th className="px-6 py-4">Company & Client Details</th>
                    <th className="px-6 py-4">Active Plan</th>
                    <th className="px-6 py-4">Subscription Status</th>
                    <th className="px-6 py-4">Remaining Duration</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DDD1]/40">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-[#6B6B6B]">
                        No clients found in MongoDB records.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => {
                      const daysLeft = getRemainingDays(client.subscription.endDate);
                      const isExpired = daysLeft <= 0 || client.subscription.status === "Expired";
                      
                      return (
                        <tr key={client._id} className="odd:bg-[#FFFFFF]/50 even:bg-white hover:bg-[#F8FAFC]/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-serif font-bold text-[#283570] text-xs">{client.companyName || "No Company"}</div>
                            <div className="text-[10px] font-semibold text-[#6B6B6B] mt-0.5">{client.name} ({client.email})</div>
                            <div className="text-[9px] text-[#6B6B6B]/80 mt-1 font-mono">Registered: {new Date(client.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-serif font-bold px-2.5 py-1 rounded-[6px] border uppercase tracking-wider ${
                              client.subscription.plan === "AI Telecalling"
                                ? "bg-[#283570] border-[#2E9E9C]/30 text-[#2E9E9C]"
                                : client.subscription.plan === "WhatsApp Chatbot"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-700"
                                : client.subscription.plan === "Smart AI-Review"
                                ? "bg-[#2E9E9C]/10 border-[#2E9E9C]/30 text-[#283570]"
                                : "bg-transparent border-dashed border-[#E2DDD1] text-[#6B6B6B]"
                            }`}>
                              {client.subscription.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-[6px] border uppercase tracking-wider ${
                              client.subscription.status === "Active" && !isExpired
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                            }`}>
                              {isExpired ? "Expired" : client.subscription.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isExpired ? (
                              <span className="text-xs font-bold text-rose-600">Plan Ended</span>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-[#2B2B2B] flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#2E9E9C]" />
                                  <span>{daysLeft} days remaining</span>
                                </div>
                                <div className="text-[9px] text-[#6B6B6B] font-semibold font-mono">
                                  Ends: {new Date(client.subscription.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openEditModal(client)}
                              className="bg-white border border-[#E2DDD1] hover:bg-[#FFFFFF] text-[#283570] hover:text-[#2E9E9C] text-[10px] font-serif font-bold px-3 py-1.5 rounded-[6px] transition-all shadow-sm flex items-center gap-1.5 inline-flex"
                            >
                              <Settings2 className="w-3.5 h-3.5" />
                              <span>Modify Plan</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Locations Database */}
          {activeTab === "locations" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFFFF] border-b border-[#E2DDD1] text-[10px] font-serif font-bold uppercase text-[#283570] tracking-wider">
                    <th className="px-6 py-4">Business Location Name</th>
                    <th className="px-6 py-4">Created By (Owner)</th>
                    <th className="px-6 py-4">Review Hyperlinks</th>
                    <th className="px-6 py-4">Registration Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DDD1]/40">
                  {filteredLocations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-[#6B6B6B]">
                        No locations registered in MongoDB.
                      </td>
                    </tr>
                  ) : (
                    filteredLocations.map((loc) => (
                      <tr key={loc._id} className="odd:bg-[#FFFFFF]/50 even:bg-white hover:bg-[#F8FAFC]/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-[#283570] text-xs">{loc.name}</span>
                            {loc.isActive === false ? (
                              <span className="bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[8px] font-bold px-2 py-0.5 rounded-[6px] uppercase tracking-wider">
                                Inactive
                              </span>
                            ) : (
                              <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[8px] font-bold px-2 py-0.5 rounded-[6px] uppercase tracking-wider">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[9px] text-[#6B6B6B]/80 font-mono mt-1">ID: {loc._id}</div>
                        </td>
                        <td className="px-6 py-4">
                          {loc.userId ? (
                            <div>
                               <div className="text-xs font-serif font-bold text-[#283570]">{loc.userId.companyName || "No Company"}</div>
                               <div className="text-[10px] text-[#6B6B6B] font-semibold mt-0.5">{loc.userId.name} ({loc.userId.email})</div>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-600 font-semibold italic">Orphaned Location</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <a 
                              href={loc.googleReviewUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-[#283570] font-bold block hover:underline truncate max-w-xs"
                            >
                              Google URL: {loc.googleReviewUrl}
                            </a>
                            {loc.yelpReviewUrl && (
                              <a 
                                href={loc.yelpReviewUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] text-[#2E9E9C] font-bold block hover:underline truncate max-w-xs"
                              >
                                Yelp URL: {loc.yelpReviewUrl}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-[#6B6B6B] font-mono">
                          {new Date(loc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedLocationForQr(loc)}
                            className="bg-white border border-[#E2DDD1] hover:bg-[#FFFFFF] text-[#283570] hover:text-[#2E9E9C] p-2 rounded-[6px] transition-colors inline-flex items-center"
                            title="View QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleLocationStatus(loc._id, loc.isActive !== false)}
                            className={`p-2 rounded-[6px] border transition-colors inline-flex items-center ${
                              loc.isActive === false
                                ? "bg-[#2E9E9C]/15 hover:bg-[#2E9E9C]/30 text-[#283570] border-[#2E9E9C]/35"
                                : "bg-[#283570]/10 hover:bg-[#283570]/20 text-[#283570] border-[#283570]/20"
                            }`}
                            title={loc.isActive === false ? "Activate Location" : "Deactivate Location"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(loc._id, loc.name)}
                            className="bg-white border border-[#E2DDD1] hover:bg-rose-50 hover:text-rose-600 text-[#283570] p-2 rounded-[6px] transition-colors inline-flex items-center"
                            title="Delete location from database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Feedbacks Database */}
          {activeTab === "reviews" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFFFF] border-b border-[#E2DDD1] text-[10px] font-serif font-bold uppercase text-[#283570] tracking-wider">
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Feedback Content</th>
                    <th className="px-6 py-4">Associated Business</th>
                    <th className="px-6 py-4 text-right">Database Clean</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DDD1]/40">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-[#6B6B6B]">
                        No customer feedback records found.
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((rev) => (
                      <tr key={rev._id} className="odd:bg-[#FFFFFF]/50 even:bg-white hover:bg-[#F8FAFC]/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-serif font-bold text-[#283570] text-xs">{rev.customerName}</div>
                          <div className="text-[10px] text-[#6B6B6B] mt-0.5">{rev.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 bg-[#2E9E9C]/15 border border-[#2E9E9C]/30 px-2 py-0.5 rounded-[6px] w-max">
                            <span className="text-xs font-bold text-[#283570]">{rev.rating}</span>
                            <span className="text-[#2E9E9C] text-[9px] font-black">★</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-[#2B2B2B] leading-relaxed italic max-w-sm">
                            "{rev.comment || "No comment left"}"
                          </p>
                          <span className={`text-[8px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded-[6px] border inline-block tracking-wider ${
                            rev.status === "public"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          }`}>
                            {rev.status === "public" ? "Google Redirect" : "Private Intercept"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {rev.businessId ? (
                            <div>
                              <div className="text-xs font-serif font-bold text-[#283570]">{rev.businessId.name}</div>
                              <div className="text-[9px] text-[#6B6B6B] font-semibold mt-0.5 font-sans">
                                Owner: {rev.businessId.userId?.companyName || "No Company"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-600 font-semibold italic">Deleted Location</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(rev._id, rev.customerName)}
                            className="bg-white border border-[#E2DDD1] hover:bg-rose-50 hover:text-rose-600 text-[#283570] p-2 rounded-[6px] transition-colors inline-flex items-center shadow-sm"
                            title="Delete review from database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* Subscription Editor Modal */}
      {isEditModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2DDD1] rounded-[6px] w-full max-w-md p-6 shadow-2xl space-y-6 animate-in zoom-in duration-200 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#283570] uppercase tracking-wider">Modify Subscription Settings</h4>
                <p className="text-xs text-[#6B6B6B] font-semibold mt-1">Client: {selectedClient.companyName}</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#6B6B6B] hover:text-[#283570] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal fields */}
            <div className="space-y-4">
              
              {/* Select Plan */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1.5">Select Tier Plan</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as any)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-bold"
                >
                  <option value="Free">Free Trial (₹0/yr)</option>
                  <option value="Smart AI-Review">Smart AI-Review (₹4,999/yr)</option>
                  <option value="WhatsApp Chatbot">WhatsApp Chatbot (₹9,999/yr)</option>
                  <option value="AI Telecalling">AI Telecalling (₹14,999/yr)</option>
                </select>
              </div>

              {/* Select Status */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1.5">Gateway Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-bold"
                >
                  <option value="Active">Active Subscription</option>
                  <option value="Expired">Expired Trial / Overdue</option>
                  <option value="Cancelled">Cancelled Profile</option>
                </select>
              </div>

              {/* End Date Datepicker */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1.5">Subscription Renewal Expiration Date</label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-bold"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="bg-white border border-[#E2DDD1] hover:bg-[#FFFFFF] text-[#6B6B6B] text-xs font-serif font-bold px-4.5 py-2.5 rounded-[6px] transition-colors"
              >
                Cancel Changes
              </button>
              <button
                type="button"
                onClick={handleSaveSubscription}
                disabled={savingPlan}
                className="bg-[#283570] hover:bg-[#2E9E9C] text-[#2E9E9C] hover:text-[#283570] text-xs font-serif font-bold px-5 py-2.5 rounded-[6px] shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {savingPlan ? "Saving Plan..." : "Confirm & Save"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2DDD1] rounded-[6px] w-full max-w-md p-6 shadow-2xl space-y-5 animate-in zoom-in duration-200 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#283570] uppercase tracking-wider">Create Client Account</h4>
                <p className="text-xs text-[#6B6B6B] font-semibold mt-1">Issue login credentials to a purchasing company</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#6B6B6B] hover:text-[#283570] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal fields */}
            <div className="space-y-3.5">
              
              {/* Client Contact Name */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Company Contact Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-semibold"
                />
              </div>

              {/* Client Email / Username */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Email Address (Login ID) *</label>
                <input
                  type="email"
                  placeholder="e.g. contact@kikashops.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-semibold"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Account Password *</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-semibold"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Kika Shops Ltd"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Select Plan */}
                <div>
                  <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Subscription Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-bold"
                  >
                    <option value="Free">Free (₹0/yr)</option>
                    <option value="Smart AI-Review">Smart AI-Review (₹4,999/yr)</option>
                    <option value="WhatsApp Chatbot">WhatsApp Chatbot (₹9,999/yr)</option>
                    <option value="AI Telecalling">AI Telecalling (₹14,999/yr)</option>
                  </select>
                </div>

                {/* Select Status */}
                <div>
                  <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* End Date Datepicker */}
              <div>
                <label className="text-[10px] text-[#6B6B6B] font-bold uppercase block mb-1">Subscription Expiration Date</label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] font-bold"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="bg-white border border-[#E2DDD1] hover:bg-[#FFFFFF] text-[#6B6B6B] text-xs font-serif font-bold px-4.5 py-2.5 rounded-[6px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateClient}
                disabled={creatingClient}
                className="bg-[#2E9E9C] hover:bg-[#283570] text-[#283570] hover:text-[#2E9E9C] border border-[#2E9E9C] text-xs font-serif font-bold px-5 py-2.5 rounded-[6px] shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {creatingClient ? "Creating Account..." : "Create Account"}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Success Modal showing generated credentials */}
      {createdCredentials && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2DDD1] rounded-[6px] w-full max-w-md p-6 shadow-2xl space-y-5 animate-in zoom-in duration-200 relative">
            
            {/* Modal Header */}
            <div className="text-center">
              <div className="bg-[#2E9E9C]/15 text-[#283570] border border-[#2E9E9C]/20 p-3 rounded-full w-max mx-auto mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#283570] uppercase tracking-wider">Client Account Created</h4>
              <p className="text-xs text-[#6B6B6B] font-semibold mt-1">Credentials have been generated successfully</p>
            </div>

            {/* Credentials details card */}
            <div className="bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] p-4 space-y-3">
              <div>
                <span className="text-[10px] text-[#6B6B6B] font-bold uppercase block">Company Name</span>
                <span className="text-xs font-serif font-bold text-[#283570]">{createdCredentials.companyName}</span>
              </div>
              <div className="border-t border-[#E2DDD1] pt-2">
                <span className="text-[10px] text-[#6B6B6B] font-bold uppercase block">Login Email / Username</span>
                <span className="text-xs font-mono font-bold text-[#2B2B2B]">{createdCredentials.email}</span>
              </div>
              <div className="border-t border-[#E2DDD1] pt-2">
                <span className="text-[10px] text-[#6B6B6B] font-bold uppercase block">Temporary Password</span>
                <span className="text-xs font-mono font-bold text-[#2B2B2B]">{createdCredentials.password}</span>
              </div>
              <div className="border-t border-[#E2DDD1] pt-2">
                <span className="text-[10px] text-[#6B6B6B] font-bold uppercase block">Login Portal Link</span>
                <span className="text-xs font-bold text-[#283570]">http://localhost:3000/login</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const text = `Dear ${createdCredentials.companyName} Team,

Your Intuik Account has been created successfully! Here are your credentials to log in:

Portal Link: http://localhost:3000/login
Login ID / Email: ${createdCredentials.email}
Password: ${createdCredentials.password}

Please log in to set up your business locations and start collecting reviews!

Best regards,
Intuik Admin`;
                  navigator.clipboard.writeText(text);
                  alert("Credentials copied to clipboard!");
                }}
                className="flex-1 bg-[#283570] hover:bg-[#2E9E9C] text-[#2E9E9C] hover:text-[#283570] border border-[#2E9E9C]/20 text-xs font-serif font-bold px-4 py-2.5 rounded-[6px] transition-all flex items-center justify-center gap-1.5"
              >
                Copy Details for Client
              </button>
              <button
                type="button"
                onClick={() => setCreatedCredentials(null)}
                className="bg-white border border-[#E2DDD1] hover:bg-[#FFFFFF] text-[#6B6B6B] text-xs font-serif font-bold px-4.5 py-2.5 rounded-[6px] transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedLocationForQr && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2DDD1] rounded-[6px] w-full max-w-sm p-6 shadow-2xl space-y-6 text-center animate-in zoom-in duration-200 relative text-[#2B2B2B]">
            <button
              onClick={() => setSelectedLocationForQr(null)}
              className="absolute top-6 right-6 text-[#6B6B6B] hover:text-[#283570] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[9px] font-bold text-[#283570] uppercase tracking-widest bg-[#2E9E9C]/15 border border-[#2E9E9C]/25 px-2.5 py-1 rounded-[6px]">
                Location QR Standee
              </span>
              <h4 className="text-sm font-serif font-bold text-[#283570] mt-3 truncate">
                {selectedLocationForQr.name}
              </h4>
              <p className="text-[10px] text-[#6B6B6B] font-semibold mt-0.5">
                Owner: {selectedLocationForQr.userId?.companyName || "No Company"}
              </p>
            </div>

            {/* QR SVG */}
            {qrMatrix.length > 0 && (
              <div className="bg-[#FFFFFF] p-6 rounded-[6px] border border-[#E2DDD1] flex justify-center items-center">
                <svg
                  id="admin-qr-svg"
                  width="180"
                  height="180"
                  viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                  className="w-44 h-44 bg-white"
                >
                  <rect width={qrMatrix.length} height={qrMatrix.length} fill="#FFFFFF" />
                  {qrMatrix.map((row, y) =>
                    row.map((val, x) => {
                      if (val === 0) return null;
                      return (
                        <rect
                          key={`${x}-${y}`}
                          x={x}
                          y={y}
                          width="1"
                          height="1"
                          fill="#283570"
                        />
                      );
                    })
                  )}
                  {/* Center Badge logo overlay */}
                  <rect x={qrMatrix.length/2 - 2.5} y={qrMatrix.length/2 - 2.5} width="5" height="5" fill="#FFFFFF" rx="0.5" />
                  <rect x={qrMatrix.length/2 - 2} y={qrMatrix.length/2 - 2} width="4" height="4" fill="#2E9E9C" rx="0.25" />
                  <path
                    d={`M${qrMatrix.length/2} ${qrMatrix.length/2 - 1.5}l.5 1h1.1l-.8.6.3 1-.9-.6-.9.6.3-1-.8-.6h1.1z`}
                    fill="#283570"
                  />
                </svg>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const svgEl = document.getElementById("admin-qr-svg");
                  if (!svgEl) return;
                  const svgString = new XMLSerializer().serializeToString(svgEl);
                  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `intuik-qr-${selectedLocationForQr.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
                  link.click();
                }}
                className="flex-1 bg-[#283570] hover:bg-[#2E9E9C] text-[#2E9E9C] hover:text-[#283570] font-serif font-bold text-xs py-2.5 rounded-[6px] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </button>
              <button
                onClick={() => {
                  const scanUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/qr/${selectedLocationForQr._id}/scan`;
                  navigator.clipboard.writeText(scanUrl);
                  alert("Scan link copied to clipboard!");
                }}
                className="bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2DDD1] text-[#283570] text-xs font-serif font-bold px-4 py-2.5 rounded-[6px] transition-all"
              >
                Copy Link
              </button>
            </div>

            <div className="text-[9px] font-semibold text-[#6B6B6B] leading-normal">
              Scan URL: <span className="font-mono text-[#2B2B2B] break-all select-all">{process.env.NEXT_PUBLIC_API_URL}/api/qr/{selectedLocationForQr._id}/scan</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
