"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Plus, 
  Wand2, 
  CheckCircle,
  MessageSquareQuote,
  LayoutTemplate,
  Trash2,
  RefreshCcw,
  Copy,
  Check,
  Search,
  ArrowLeft,
  Lock,
  Edit2,
  X,
  QrCode,
  Download,
  Globe,
  Building2
} from "lucide-react";
import QRCode from "qrcode";
import { getDB, saveUser } from "@/lib/db";

// Interfaces
interface GeneratedReview {
  id: string;
  category: string;
  text: string;
  status: "AVAILABLE" | "USED";
  createdAt: string;
}

interface ReviewConfig {
  category: string;
  businessName: string;
  businessCategory: string;
  keywords: string;
  usp: string;
  location: string;
  language: string;
  tone: string;
  style: string;
  wordLimit: string;
  numReviews: string;
  serviceArea: string;
  otherSuggestions: string;
}

const generateRealQrMatrix = (bizId?: string) => {
  const frontendUrl = typeof window !== 'undefined' ? window.location.origin : "https://intquik-amr2.vercel.app";
  const url = bizId ? `${frontendUrl}/review/${bizId}` : "http://intuik.com";
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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [categoriesList, setCategoriesList] = useState<string[]>(["GENERAL", "SERVICE", "PRODUCT", "FOOD / BEVERAGE", "AMBIENCE", "STAFF BEHAVIOR"]);
  
  // State for config & reviews list
  const [config, setConfig] = useState<ReviewConfig>({
    category: "GENERAL",
    businessName: "",
    businessCategory: "",
    keywords: "",
    usp: "",
    location: "",
    language: "English",
    tone: "Natural",
    style: "Detailed",
    wordLimit: "40-50 Words",
    numReviews: "10",
    serviceArea: "",
    otherSuggestions: "",
  });

  const [reviewsList, setReviewsList] = useState<GeneratedReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AVAILABLE" | "USED">("ALL");
  const [copiedReviewId, setCopiedReviewId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Edit review state
  const [editingReview, setEditingReview] = useState<GeneratedReview | null>(null);
  const [editFormText, setEditFormText] = useState("");

  // Locations/QR State
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loadingLocs, setLoadingLocs] = useState(false);
  const [showAddLocModal, setShowAddLocModal] = useState(false);
  const [selectedLocationForQr, setSelectedLocationForQr] = useState<any | null>(null);
  const [qrMatrix, setQrMatrix] = useState<number[][]>([]);

  // Calculate location limits
  const planName = user?.subscription?.plan || "Free";
  const locationLimits: Record<string, number> = {
    Free: 1,
    Starter: 1,
    Growth: 5,
    Professional: 5,
    Enterprise: 99999
  };
  const maxLocations = locationLimits[planName] || 1;
  const isLimitReached = businesses.length >= maxLocations;

  // Add Location Form fields
  const [newLocName, setNewLocName] = useState("");
  const [newLocGoogleUrl, setNewLocGoogleUrl] = useState("");
  const [newLocYelpUrl, setNewLocYelpUrl] = useState("");
  const [newLocColor, setNewLocColor] = useState("#0D9488");
  const [newLocThreshold, setNewLocThreshold] = useState(4);
  const [newLocLogo, setNewLocLogo] = useState<File | null>(null);
  const [creatingLocation, setCreatingLocation] = useState(false);

  // Load locations from API
  const loadUserLocations = async () => {
    setLoadingLocs(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data);
      }
    } catch (err) {
      console.error("Failed to load user locations:", err);
    } finally {
      setLoadingLocs(false);
    }
  };

  // Handle new location submission
  const handleAddLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocGoogleUrl.trim()) return;

    setCreatingLocation(true);
    try {
      const formData = new FormData();
      formData.append("name", newLocName);
      formData.append("googleReviewUrl", newLocGoogleUrl);
      if (newLocYelpUrl) formData.append("yelpReviewUrl", newLocYelpUrl);
      formData.append("primaryColor", newLocColor);
      formData.append("ratingThreshold", newLocThreshold.toString());
      if (newLocLogo) formData.append("logo", newLocLogo);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        // Reset form & reload
        setNewLocName("");
        setNewLocGoogleUrl("");
        setNewLocYelpUrl("");
        setNewLocColor("#0D9488");
        setNewLocThreshold(4);
        setNewLocLogo(null);
        setShowAddLocModal(false);
        await loadUserLocations();
      } else if (res.status === 403) {
        const errData = await res.json();
        alert(errData.message || "Upgrade your plan to add more business locations!");
      } else {
        alert("Failed to create location.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error creating business location.");
    } finally {
      setCreatingLocation(false);
    }
  };

  const handleDeleteLocation = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone and will delete all associated reviews.`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await loadUserLocations();
      } else {
        alert("Failed to delete location.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting business location.");
    }
  };

  // Generate QR Matrix when selectedLocationForQr changes
  useEffect(() => {
    if (selectedLocationForQr) {
      setQrMatrix(generateRealQrMatrix(selectedLocationForQr._id));
    } else {
      setQrMatrix([]);
    }
  }, [selectedLocationForQr]);

  // Load database and local config
  useEffect(() => {
    const db = getDB();
    if (db.user) {
      if (db.user.role === "admin") {
        window.location.href = "/dashboard/owner";
        return;
      }
      setUser(db.user);
      const plan = db.user.subscription?.plan;
      if (plan === "Professional" || plan === "Enterprise" || plan === "Growth") {
        setIsUnlocked(true);
      }
      loadUserLocations();
    }

    // Load custom configurations and generated reviews from localStorage
    const savedReviews = localStorage.getItem("rp_generated_reviews_list");
    if (savedReviews && !savedReviews.toLowerCase().includes("damas") && !savedReviews.toLowerCase().includes("chocolate")) {
      setReviewsList(JSON.parse(savedReviews));
    } else {
      // Default reviews matching Aura Boutique reference
      const defaultReviews: GeneratedReview[] = [
        {
          id: "gr-1",
          category: "GENERAL",
          text: "The moment I stepped in, the experience was inviting and premium. The staff was friendly and knowledgeable, helping me choose the best options. The items I got were absolutely wonderful. Will definitely return for more!",
          status: "AVAILABLE",
          createdAt: "18-06-2026",
        },
        {
          id: "gr-2",
          category: "GENERAL",
          text: "I recently purchased from this boutique, and I must say, the quality is divine. Each piece has a unique design. The elegant packaging also makes them perfect as gifts. A true delight!",
          status: "AVAILABLE",
          createdAt: "18-06-2026",
        },
        {
          id: "gr-3",
          category: "GENERAL",
          text: "This is a shopper's paradise! The quality and selection are top-notch. I particularly enjoyed the curated styles; they are unique and well crafted. Can't wait to go back.",
          status: "USED",
          createdAt: "08-06-2026",
        },
        {
          id: "gr-4",
          category: "GENERAL",
          text: "I had an amazing experience selecting gifts for my family here. The staff was so kind and helpful. The custom packaging is a particular favorite; it's a unique touch.",
          status: "AVAILABLE",
          createdAt: "08-06-2026",
        },
      ];
      setReviewsList(defaultReviews);
      localStorage.setItem("rp_generated_reviews_list", JSON.stringify(defaultReviews));
    }

    const savedConfig = localStorage.getItem("rp_generator_config");
    if (savedConfig && !savedConfig.toLowerCase().includes("damas") && !savedConfig.toLowerCase().includes("chocolate")) {
      setConfig(JSON.parse(savedConfig));
    } else {
      const defaultCfg = {
        category: "GENERAL",
        businessName: (db.user && db.user.companyName && !db.user.companyName.toLowerCase().includes("damas")) ? db.user.companyName : "Aura Boutique",
        businessCategory: "Premium Retail Boutique",
        keywords: "High quality fashion, Friendly staff, Beautiful collection",
        usp: "Curated styles, Exceptional craftsmanship",
        location: "New Delhi",
        language: "English",
        tone: "Natural",
        style: "Detailed",
        wordLimit: "40-50 Words",
        numReviews: "10",
        serviceArea: "Delhi NCR",
        otherSuggestions: "",
      };
      setConfig(defaultCfg);
      localStorage.setItem("rp_generator_config", JSON.stringify(defaultCfg));
    }

    const savedCats = localStorage.getItem("rp_custom_categories");
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      const activeCats = parsed.filter((c: any) => c.isActive).map((c: any) => c.name);
      if (activeCats.length > 0) {
        setCategoriesList(activeCats);
        setConfig(prev => ({ ...prev, category: activeCats[0] }));
      }
    }
  }, []);

  const handleUpgradePlan = () => {
    const db = getDB();
    if (db.user) {
      const updated = {
        ...db.user,
        subscription: {
          plan: "Professional" as const,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: "Active" as const
        }
      };
      saveUser(updated);
      setUser(updated);
      setIsUnlocked(true);
    }
  };

  const handleCopyLink = () => {
    const link = `https://intuik.co/r/${config.businessName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "gMozRU"}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyReview = (review: GeneratedReview) => {
    navigator.clipboard.writeText(review.text);
    setCopiedReviewId(review.id);
    
    // Mark as USED on copy
    const updated = reviewsList.map(r => r.id === review.id ? { ...r, status: "USED" as const } : r);
    setReviewsList(updated);
    localStorage.setItem("rp_generated_reviews_list", JSON.stringify(updated));

    setTimeout(() => setCopiedReviewId(null), 2000);
  };

  const handleDeleteReview = (id: string) => {
    const updated = reviewsList.filter(r => r.id !== id);
    setReviewsList(updated);
    localStorage.setItem("rp_generated_reviews_list", JSON.stringify(updated));
  };

  const handleRegenerateReview = (review: GeneratedReview) => {
    const newText = generateSingleReviewText(config, review.category);
    const updated = reviewsList.map(r => r.id === review.id ? { ...r, text: newText, status: "AVAILABLE" as const } : r);
    setReviewsList(updated);
    localStorage.setItem("rp_generated_reviews_list", JSON.stringify(updated));
  };

  const handleSaveEdit = () => {
    if (!editingReview) return;
    const updated = reviewsList.map(r => r.id === editingReview.id ? { ...r, text: editFormText } : r);
    setReviewsList(updated);
    localStorage.setItem("rp_generated_reviews_list", JSON.stringify(updated));
    setEditingReview(null);
  };

  // Automated smart review content generator
  const generateSingleReviewText = (c: ReviewConfig, reviewCategory: string) => {
    const bName = c.businessName || "Aura Boutique";
    const loc = c.location || "Delhi";
    
    // Split keywords & USPs
    const kwArr = c.keywords.split(",").map(k => k.trim()).filter(Boolean);
    const uspArr = c.usp.split(",").map(u => u.trim()).filter(Boolean);
    
    const kw1 = kwArr[0] || "exceptional products";
    const kw2 = kwArr[1] || "great quality";
    const usp1 = uspArr[0] || "trusted service standard";

    // Text pools based on tone
    let templates: string[] = [];

    if (c.tone === "Natural" || c.tone === "Casual") {
      templates = [
        `Absolutely loved my visit to ${bName} in ${loc}. The ${kw1} was perfect and they really carry that ${usp1} in everything they offer. Friendly team too!`,
        `If you need quality ${c.businessCategory || "items"}, definitely check out ${bName}. Their ${kw2} in ${loc} is amazing. Great experience overall!`,
        `Visited ${bName} recently. You can immediately notice their ${usp1}. The selection of ${kw1} is top-tier. Servicing ${c.serviceArea || "the local area"} beautifully.`,
        `Had a wonderful experience with ${bName}. Their ${kw1} and ${kw2} are highly recommended. So glad we have this in ${loc}!`,
      ];
    } else if (c.tone === "Enthusiastic") {
      templates = [
        `Wow! The selection of ${kw1} at ${bName} is absolute perfection! Their ${usp1} is fully evident. 10/10 recommended in ${loc}!`,
        `Best ${c.businessCategory || "store"} in town! ${bName} has outstanding ${kw1} and premium ${kw2}. Don't miss out on this gem in ${loc}!`,
        `Hands down the best place for ${kw1}! ${bName} really delivers on their promise of ${usp1}. Outstanding service across ${c.serviceArea || "the region"}!`,
      ];
    } else { // Professional
      templates = [
        `${bName} offers highly reliable ${c.businessCategory || "services"} in ${loc}. Their focus on ${kw1} and ${usp1} represents excellent quality.`,
        `Highly professional experience working with ${bName}. Their selection of ${kw1} is outstanding and their ${usp1} provides complete peace of mind.`,
        `If you are seeking premium ${kw2} in ${loc}, I recommend ${bName}. They possess ${usp1} and serve the ${c.serviceArea || "entire area"} efficiently.`,
      ];
    }

    // Select random template
    const randomIndex = Math.floor(Math.random() * templates.length);
    let generated = templates[randomIndex];

    // Style adjustments
    if (c.style === "Short & Sweet") {
      generated = generated.split(". ").slice(0, 2).join(". ");
    } else if (c.style === "Story-based") {
      generated = `I was looking for the best ${kw1} in ${loc} and came across ${bName}. ` + generated;
    }

    // Suggestions constraint (e.g. no exclamation marks)
    if (c.otherSuggestions.toLowerCase().includes("no !") || c.otherSuggestions.toLowerCase().includes("no exclamation")) {
      generated = generated.replace(/!/g, ".");
    }

    return generated;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/generate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to generate reviews");
      }

      const generatedTexts: string[] = await res.json();
      const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); // DD-MM-YYYY
      const generatedReviews: GeneratedReview[] = generatedTexts.map((text, i) => ({
        id: `gr-${Date.now()}-${i}`,
        category: config.category,
        text,
        status: "AVAILABLE",
        createdAt: dateStr
      }));

      const updatedList = [...generatedReviews, ...reviewsList];
      setReviewsList(updatedList);
      localStorage.setItem("rp_generated_reviews_list", JSON.stringify(updatedList));
      localStorage.setItem("rp_generator_config", JSON.stringify(config));

      setView("list");
    } catch (error) {
      console.error("Error generating reviews:", error);
      alert("There was an error generating the reviews. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter list
  const filteredReviews = reviewsList.filter(r => {
    const matchesSearch = r.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Locked Gate View removed as requested

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[32px] w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-blue-900">
            <button 
              onClick={() => setEditingReview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-black text-blue-950 mb-4">Edit Review Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1.5">Review Content</label>
                <textarea
                  value={editFormText}
                  onChange={(e) => setEditFormText(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3 py-2 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 resize-none h-28 leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setEditingReview(null)}
                  className="bg-gray-100 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-[14px] hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-[14px] hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Main Container Switch */}
      {view === "list" ? (
        <div className="space-y-6">
          {/* Header Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 mb-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Review Config System Active</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-blue-950 tracking-tight">Reviews List ({reviewsList.length})</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Configure parameters and auto-generate target review suggestions for your customers.</p>
            </div>
            
            <button
              onClick={() => setView("form")}
              className="bg-blue-600 text-white border border-transparent hover:bg-blue-700 hover:text-white text-xs font-bold px-4 py-3 rounded-[14px] transition-colors duration-200 flex items-center gap-1.5 shadow-sm self-start"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ ADD NEW</span>
            </button>
          </div>          {/* Business Locations & QR Codes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-blue-950 uppercase tracking-widest flex items-center gap-1.5 bg-white border border-slate-200 rounded-[14px] px-3.5 py-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Your Registered Business Locations & QR Codes</span>
              </h3>
              
              <button
                onClick={() => {
                  if (isLimitReached) {
                    const upgrade = window.confirm(`You've reached your limit of ${maxLocations} location(s) on the ${planName} plan. Upgrade your plan to add more locations!`);
                    if (upgrade) {
                      window.location.href = "/dashboard/plans";
                    }
                  } else {
                    setShowAddLocModal(true);
                  }
                }}
                className={`text-[10px] font-bold px-3.5 py-2 rounded-[14px] transition-colors flex items-center gap-1 ${
                  isLimitReached 
                    ? "bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800" 
                    : "bg-white border border-slate-200 hover:bg-white text-blue-950 hover:text-blue-600"
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isLimitReached ? "Upgrade for More Locations" : "Add Location"}</span>
              </button>
            </div>

            {businesses.length === 0 ? (
              <div className="bg-white border border-dashed border-blue-600 rounded-[14px] p-8 text-center space-y-3.5">
                <Building2 className="w-8 h-8 text-blue-600 mx-auto" />
                <h3 className="font-bold text-blue-950 text-lg">No locations added yet</h3>
                <p className="text-[10px] text-gray-500 font-semibold max-w-xs mx-auto leading-relaxed">
                  Add your first business location to generate a custom review routing portal and its QR standee code.
                </p>
                <button
                  onClick={() => setShowAddLocModal(true)}
                  className="bg-blue-600 text-white border border-transparent hover:bg-blue-700 hover:text-white text-[10px] font-bold px-4 py-2.5 rounded-[14px] transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Location Now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businesses.map((loc) => {
                  const scanUrl = typeof window !== 'undefined' ? `${window.location.origin}/review/${loc._id}` : `https://intquik-amr2.vercel.app/review/${loc._id}`;
                  return (
                    <div key={loc._id} className="bg-white border border-slate-200 p-6 rounded-[14px] flex justify-between items-center hover:border-blue-600/50 transition-all duration-350 group">
                      <div className="space-y-2 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: loc.primaryColor || '#2E9E9C' }} />
                          <h4 className="text-xs font-bold text-blue-950 truncate">{loc.name}</h4>
                          
                          {loc.isActive === false ? (
                            <span className="bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[8px] font-bold px-2 py-0.5 rounded-[14px] uppercase tracking-wider">
                              Deactivated
                            </span>
                          ) : (
                            <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[8px] font-bold px-2 py-0.5 rounded-[14px] uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        
                        <div className="text-[10px] text-gray-500 font-bold truncate max-w-xs font-mono select-all flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-600" />
                          <span>{scanUrl}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(scanUrl);
                            alert("Review link copied to clipboard!");
                          }}
                          className="bg-white hover:bg-white text-blue-950 hover:text-blue-600 border border-slate-200 p-2 rounded-[14px] transition-colors"
                          title="Copy Public Review Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {loc.isActive !== false && (
                          <button
                            onClick={() => setSelectedLocationForQr(loc)}
                            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border border-transparent p-2 rounded-[14px] transition-colors flex items-center justify-center"
                            title="Download QR Code Standee"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteLocation(loc._id, loc.name)}
                          className="bg-white hover:bg-rose-50 text-blue-950 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 rounded-[14px] transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-[14px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white hover:bg-white border border-slate-200 rounded-[14px] pl-10 pr-4 py-2.5 text-xs text-[#2B2B2B] focus:ring-2 focus:ring-[#2E9E9C] focus:border-blue-600 focus:bg-white outline-none transition-colors font-semibold placeholder:text-gray-500"
              />
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-[14px] border border-slate-200 self-stretch sm:self-auto">
              {(["ALL", "AVAILABLE", "USED"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`text-[10px] font-bold px-4 py-2 rounded-[14px] uppercase tracking-wider transition-all duration-200 flex-1 sm:flex-none ${
                    statusFilter === filter 
                      ? "bg-blue-600 text-white border border-transparent shadow-sm" 
                      : "text-gray-500 hover:text-blue-950"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List Table */}
          <div className="bg-white border border-slate-200 rounded-[14px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white text-[9px] font-bold text-blue-950 uppercase tracking-widest">
                    <th className="py-4 px-6 w-16">Sr. No.</th>
                    <th className="py-4 px-6 w-28">Review Category</th>
                    <th className="py-4 px-6">Review</th>
                    <th className="py-4 px-6 w-32">Status</th>
                    <th className="py-4 px-6 w-32">Created Date</th>
                    <th className="py-4 px-6 w-36 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 text-xs font-semibold text-[#2B2B2B]">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <LayoutTemplate className="w-10 h-10 text-blue-600 mb-3" />
                          <p className="text-blue-950 font-bold">No generated reviews found</p>
                          <p className="text-gray-500 font-medium text-[11px] mt-1">Configure target business details and generate reviews to populate the list dashboard.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((rev, index) => (
                      <tr 
                        key={rev.id} 
                        className="odd:bg-white even:bg-white hover:bg-[#F8FAFC]/20 transition-colors"
                      >
                        <td className="py-5 px-6 font-mono text-gray-500">{index + 1}</td>
                        <td className="py-5 px-6">
                          <span className="bg-blue-600/15 border border-transparent/30 text-blue-950 text-[9px] font-bold uppercase px-2.5 py-1 rounded-[14px] tracking-wider">
                            {rev.category}
                          </span>
                        </td>
                        <td className="py-5 px-6 max-w-md leading-relaxed pr-8 font-medium text-[#2B2B2B]">
                          "{rev.text}"
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center text-[9px]  font-bold uppercase tracking-wider px-2.5 py-1 rounded-[14px] border ${
                            rev.status === "AVAILABLE" 
                              ? "bg-transparent text-blue-950 border-blue-950" 
                              : "bg-transparent text-gray-500 border-slate-200"
                          }`}>
                            {rev.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-mono text-[11px] text-gray-500">{rev.createdAt}</td>
                        <td className="py-5 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Regenerate */}
                            <button
                              onClick={() => handleRegenerateReview(rev)}
                              title="Regenerate Review content"
                              className="p-2 bg-white hover:bg-white hover:text-blue-600 text-blue-950 rounded-[14px] border border-slate-200 transition-colors"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy Review */}
                            <button
                              onClick={() => handleCopyReview(rev)}
                              title="Copy to clipboard"
                              className={`p-2 rounded-[14px] border transition-all ${
                                copiedReviewId === rev.id
                                  ? "bg-blue-600/15 text-blue-950 border-blue-600/40"
                                  : "bg-white hover:bg-white hover:text-blue-600 text-blue-950 border-slate-200"
                              }`}
                            >
                              {copiedReviewId === rev.id ? <Check className="w-4 h-4 text-[#FF5A3C] shrink-0" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Edit Review */}
                            <button
                              onClick={() => {
                                setEditingReview(rev);
                                setEditFormText(rev.text);
                              }}
                              title="Edit Review content"
                              className="p-2 bg-white hover:bg-white hover:text-blue-600 text-blue-950 rounded-[14px] border border-slate-200 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Review */}
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              title="Delete Review"
                              className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 text-blue-950 rounded-[14px] border border-slate-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Form view: Add Review Configuration */
        <div className="space-y-6">
          {/* Form Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("list")}
              className="p-2.5 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] hover:bg-slate-50 text-blue-800 shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-black text-blue-950 tracking-tight">Add Review Configuration</h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Input targeted parameters to generate context-rich positive reviews.</p>
            </div>
          </div>

          {/* Form Card Grid */}
          <form 
            onSubmit={handleFormSubmit}
            className="bg-white/80 backdrop-blur-md border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 md:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Review Category */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Review Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.category}
                  onChange={(e) => setConfig({ ...config, category: e.target.value })}
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner"
                  required
                >
                  {categoriesList.map((catName) => (
                    <option key={catName} value={catName}>{catName}</option>
                  ))}
                </select>
              </div>

              {/* Business Name */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                  placeholder="e.g. Aura Boutique"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Business Category */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Business Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.businessCategory}
                  onChange={(e) => setConfig({ ...config, businessCategory: e.target.value })}
                  placeholder="e.g. Premium Retail Boutique"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Keywords <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.keywords}
                  onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                  placeholder="e.g. High quality fashion, Friendly staff"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                  required
                />
              </div>

              {/* USP */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  USP (comma-separated) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={config.usp}
                  onChange={(e) => setConfig({ ...config, usp: e.target.value })}
                  placeholder="e.g. Curated styles, Curated premium collections"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400 h-11.5 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.location}
                  onChange={(e) => setConfig({ ...config, location: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Language */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner"
                  required
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              {/* Review Tone */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Review Tone <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.tone}
                  onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner"
                  required
                >
                  <option value="Natural">Natural</option>
                  <option value="Professional">Professional</option>
                  <option value="Enthusiastic">Enthusiastic</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>

              {/* Review Style */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Review Style <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.style}
                  onChange={(e) => setConfig({ ...config, style: e.target.value })}
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner"
                  required
                >
                  <option value="Detailed">Detailed</option>
                  <option value="Short & Sweet">Short & Sweet</option>
                  <option value="Story-based">Story-based</option>
                </select>
              </div>

              {/* Word Limit */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Word Limit <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.wordLimit}
                  onChange={(e) => setConfig({ ...config, wordLimit: e.target.value })}
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner"
                  required
                >
                  <option value="20-30 Words">20-30 Words</option>
                  <option value="40-50 Words">40-50 Words</option>
                  <option value="80-100 Words">80-100 Words</option>
                </select>
              </div>

              {/* Number of Reviews */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Number of Reviews <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.numReviews}
                  onChange={(e) => setConfig({ ...config, numReviews: e.target.value })}
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner"
                  required
                >
                  <option value="5">5 Reviews</option>
                  <option value="10">10 Reviews</option>
                  <option value="25">25 Reviews</option>
                  <option value="50">50 Reviews</option>
                  <option value="100">100 Reviews</option>
                </select>
              </div>

              {/* Service Area */}
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Service Area
                </label>
                <input
                  type="text"
                  value={config.serviceArea}
                  onChange={(e) => setConfig({ ...config, serviceArea: e.target.value })}
                  placeholder="e.g. Enter service area"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                />
              </div>

              {/* Other Suggestions */}
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
                  Other Suggestions
                </label>
                <textarea
                  value={config.otherSuggestions}
                  onChange={(e) => setConfig({ ...config, otherSuggestions: e.target.value })}
                  placeholder="e.g. Do not add ! mark to any review, do not use negative keywords..."
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400 h-24 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end gap-3.5 pt-6 border-t border-slate-200/40">
              <button
                type="button"
                onClick={() => setView("list")}
                className="bg-slate-100 text-blue-800 font-bold text-xs px-6 py-3.5 rounded-[14px] hover:bg-slate-200 transition-all active:scale-[0.98]"
              >
                CANCEL
              </button>
              
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 rounded-[14px] transition-all shadow-md shadow-blue-500/10 hover:shadow-lg active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>GENERATING AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 stroke-[2.5]" />
                    <span>SUBMIT</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer QR Code Download Modal */}
      {selectedLocationForQr && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[32px] w-full max-w-sm p-6 shadow-2xl space-y-6 text-center animate-in zoom-in duration-200 relative text-blue-900">
            <button
              onClick={() => setSelectedLocationForQr(null)}
              className="absolute top-4 right-4 text-slate-450 hover:text-blue-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100/30">
                Your Location QR Standee
              </span>
              <h4 className="text-sm font-black text-blue-950 mt-3 truncate">
                {selectedLocationForQr.name}
              </h4>
              <p className="text-[10px] text-gray-500 font-bold mt-1">
                Scan to leave a Google Review
              </p>
            </div>

            {/* QR SVG */}
            {qrMatrix.length > 0 && (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-center items-center">
                <svg
                  id="user-qr-svg"
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
                          fill="#000000"
                        />
                      );
                    })
                  )}
                </svg>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const svgEl = document.getElementById("user-qr-svg");
                  if (!svgEl) return;
                  const svgString = new XMLSerializer().serializeToString(svgEl);
                  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `qr-standee-${selectedLocationForQr.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
                  link.click();
                }}
                className="flex-1 bg-blue-600 text-white font-bold text-xs py-3 rounded-[14px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </button>
              <button
                onClick={() => {
                  const scanUrl = typeof window !== 'undefined' ? `${window.location.origin}/review/${selectedLocationForQr._id}` : `https://intquik-amr2.vercel.app/review/${selectedLocationForQr._id}`;
                  navigator.clipboard.writeText(scanUrl);
                  alert("Review link copied!");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-blue-800 text-xs font-bold px-4 py-3 rounded-[14px] transition-all"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Add Location Modal */}
      {showAddLocModal && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[32px] w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in duration-200 text-blue-900">
            <button
              onClick={() => setShowAddLocModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Add New Business Location</h3>
            </div>

            <form onSubmit={handleAddLocationSubmit} className="space-y-4.5">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Location Name</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. Aura Boutique (Connaught Place)"
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3.5 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400 shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Google Review Link</label>
                <input
                  type="url"
                  required
                  value={newLocGoogleUrl}
                  onChange={(e) => setNewLocGoogleUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3.5 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400 shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-550 font-bold uppercase block mb-1.5">Yelp Review Link (Optional)</label>
                <input
                  type="url"
                  value={newLocYelpUrl}
                  onChange={(e) => setNewLocYelpUrl(e.target.value)}
                  placeholder="https://www.yelp.com/biz/..."
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3.5 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400 shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Rating Threshold</label>
                <select
                  value={newLocThreshold}
                  onChange={(e) => setNewLocThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3.5 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold shadow-inner"
                >
                  <option value={5}>5 Stars Only</option>
                  <option value={4}>4 Stars and Up</option>
                  <option value={3}>3 Stars and Up</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddLocModal(false)}
                  className="bg-slate-100 text-slate-650 font-bold text-xs px-4 py-2.5 rounded-[14px] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingLocation}
                  className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-[14px] hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
                >
                  {creatingLocation ? "Adding..." : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
