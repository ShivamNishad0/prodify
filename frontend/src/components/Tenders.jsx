import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiSearch, FiExternalLink, FiCalendar, FiDollarSign, FiBriefcase, FiMapPin, FiFilter, FiTag, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const STYLE = {
  container: {
    padding: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "90vh",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    padding: "25px",
    border: "1px solid #f1f5f9",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  },
  filterSection: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    marginBottom: "30px",
    border: "1px solid #f1f5f9"
  },
  input: {
    padding: "12px 15px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s"
  },
  primaryColor: "#3cb2a8",
  secondaryColor: "#2a8a81",
};

const initialFilters = {
  search: "",
  category: "",
  organization: "",
  status: "",
  location: ""
};

function Tenders() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchTenders = useCallback(async (page, currentFilters) => {
    try {
      setLoading(true);
      setError(null);

      const allParams = { ...currentFilters, page, limit: pagination.limit };
      const params = new URLSearchParams();

      Object.entries(allParams).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, value);
        }
      });

      const response = await axios.get(`/api/tenders?${params.toString()}`);
      const { tenders: fetchedTenders, pagination: apiPagination } = response.data;

      setTenders(fetchedTenders);
      setPagination(prev => ({
        ...prev,
        page: apiPagination.page,
        pages: apiPagination.pages,
        total: apiPagination.total,
      }));
    } catch (err) {
      console.error("Error fetching tenders", err);
      setError("Failed to load tenders. Please check your network connection or try again.");
      setTenders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/tenders/categories/list");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchTenders(1, initialFilters);
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTenders(1, filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchTenders]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchTenders(newPage, filters);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return 'Not Specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return { bg: '#e6f4ea', color: '#1e7e34' };
      case 'Closed': return { bg: '#feeaef', color: '#d63384' };
      case 'Awarded': return { bg: '#e7f3ff', color: '#0061c1' };
      default: return { bg: '#f8f9fa', color: '#6c757d' };
    }
  };

  const applyToGem = () => {
    window.open(`https://gem.gov.in/`, '_blank');
  };

  return (
    <div style={STYLE.container}>
      {/* Header */}
      <div style={{
        ...STYLE.card,
        background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
        color: 'white',
        border: 'none',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>Government Tenders</h1>
          <p style={{ margin: '0', opacity: '0.9', fontSize: '16px' }}>Explore business opportunities through the GeM portal</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
            <FiClock /> Recent Only
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div style={STYLE.filterSection}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: "relative", flex: 1 }}>
            <FiSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by title, organization, or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              style={{ ...STYLE.input, paddingLeft: "45px" }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: showFilters ? STYLE.primaryColor : "#f1f5f9",
              color: showFilters ? "white" : "#475569",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              transition: "all 0.2s"
            }}
          >
            <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9",
            animation: "slideDown 0.3s ease-out"
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                style={STYLE.input}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Organization</label>
              <input
                type="text"
                placeholder="Ex: ISRO, NHAI..."
                value={filters.organization}
                onChange={(e) => handleFilterChange("organization", e.target.value)}
                style={STYLE.input}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                style={STYLE.input}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Awarded">Awarded</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Location</label>
              <input
                type="text"
                placeholder="City or State..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                style={STYLE.input}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tenders List */}
      <div style={{ marginBottom: "30px" }}>
        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "15px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        {loading && tenders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3cb2a8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#64748b' }}>Fetching latest tenders...</p>
          </div>
        ) : tenders.length === 0 ? (
          <div style={{ ...STYLE.card, textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
            <FiTag size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
            <h3>No tenders found</h3>
            <p>Try adjusting your search or filters to see more results.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "25px" }}>
            {tenders.map((tender) => {
              const status = getStatusStyle(tender.status);
              return (
                <div
                  key={tender._id}
                  style={STYLE.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, color: "#1e293b", fontSize: "20px", fontWeight: "700" }}>{tender.title}</h3>
                        <span style={{
                          backgroundColor: status.bg,
                          color: status.color,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700"
                        }}>
                          {tender.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "14px", color: "#64748b" }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiBriefcase /> {tender.organization}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiMapPin /> {tender.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#3cb2a8' }}><FiDollarSign /> {formatCurrency(tender.estimatedValue)}</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ color: "#475569", marginBottom: "20px", lineHeight: "1.6", fontSize: "15px" }}>
                    {tender.description?.substring(0, 250)}...
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "13px", color: "#94a3b8", display: 'flex', gap: '20px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiTag /> ID: <b style={{ color: '#475569' }}>{tender.tenderId}</b></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCalendar /> Deadline: <b style={{ color: '#d63384' }}>{formatDate(tender.applicationDeadline)}</b></span>
                    </div>
                    <button
                      onClick={applyToGem}
                      style={{
                        backgroundColor: STYLE.primaryColor,
                        color: "#fff",
                        border: "none",
                        padding: "10px 24px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: "700",
                        boxShadow: "0 4px 12px rgba(60, 178, 168, 0.25)"
                      }}
                    >
                      <FiExternalLink /> View on GeM
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "40px" }}>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={{
              padding: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: pagination.page === 1 ? "#f8f9fa" : "white",
              color: pagination.page === 1 ? "#cbd5e1" : "#475569",
              borderRadius: "10px",
              cursor: pagination.page === 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            <FiChevronLeft size={20} />
          </button>

          <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
            Page <b style={{ color: '#1e293b' }}>{pagination.page}</b> of {pagination.pages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            style={{
              padding: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: pagination.page === pagination.pages ? "#f8f9fa" : "white",
              color: pagination.page === pagination.pages ? "#cbd5e1" : "#475569",
              borderRadius: "10px",
              cursor: pagination.page === pagination.pages ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Tenders;