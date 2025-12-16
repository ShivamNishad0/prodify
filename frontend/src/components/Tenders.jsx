import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSearch, FaExternalLinkAlt, FaCalendarAlt, FaRupeeSign, FaBuilding, FaMapMarkerAlt, FaFilter } from "react-icons/fa";

// --- 1. CONSTANTS AND STYLES ---

const STYLE = {
  container: {
    padding: "20px",
    marginLeft: "50px",
    minHeight: "90vh",
    backgroundColor: "#f4f6f8"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    padding: "20px"
  },
  filterSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    width: "100%"
  },
  primaryColor: "#007bff", // Blue for Apply button
  secondaryColor: "#3cb2a8", // Teal for Filter button
};

const initialFilters = {
  search: "",
  category: "",
  organization: "",
  status: "",
  location: ""
};

// --- 2. MAIN COMPONENT ---

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

  // --- 3. DATA FETCHING LOGIC ---

  // Memoized function for fetching tenders
  const fetchTenders = useCallback(async (page, currentFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Combine current filters with pagination parameters
      const allParams = { ...currentFilters, page, limit: pagination.limit };
      const params = new URLSearchParams();

      // Only append parameters that have a truthy value (removes empty strings)
      Object.entries(allParams).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString(); 

      const response = await axios.get(`/api/tenders?${queryString}`);
      
      const { tenders: fetchedTenders, pagination: apiPagination } = response.data;

      setTenders(fetchedTenders);
      setPagination(prev => ({
        ...prev, // Keep existing limit
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
  }, [pagination.limit]); // Dependency on limit

  // Function to fetch unique categories for the filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/tenders/categories/list");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  // Initial Data Load (Runs once on mount)
  useEffect(() => {
    fetchTenders(1, initialFilters); 
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- 4. SEARCH BAR FIX (DEBOUNCING) ---
  
  // This effect handles debounced searching and filtering
  useEffect(() => {
    // Set a timer to wait 500ms after the last filter change
    const timer = setTimeout(() => {
      // When filters change, always reset to the first page (page 1)
      fetchTenders(1, filters); 
    }, 500);

    // Cleanup function: If filters change before 500ms, clear the previous timer
    return () => clearTimeout(timer);
  }, [filters, fetchTenders]); // Triggers whenever filters change

  // --- 5. HANDLERS AND FORMATTERS ---

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchTenders(newPage, filters);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return 'Value Not Specified';

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745'; // Green
      case 'Closed': return '#dc3545'; // Red
      case 'Under Evaluation': return '#ffc107'; // Yellow
      case 'Awarded': return '#17a2b8'; // Cyan
      default: return '#6c757d'; // Gray
    }
  };

  const applyToGem = () => {
    // Redirects to the generic GeM portal
    const gemUrl = `https://gem.gov.in/`;
    window.open(gemUrl, '_blank');
  };

  // --- 6. LOADING/ERROR/EMPTY STATES ---

  if (loading && tenders.length === 0 && !error) {
    return (
      <div style={STYLE.container}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="spinner"></div>
          <p>Loading tenders...</p>
        </div>
      </div>
    );
  }

  // --- 7. MAIN RENDER ---

  return (
    <div style={STYLE.container}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ marginBottom: "10px", color: "#333" }}>Government Tenders</h1>
        <p style={{ color: "#666" }}>Browse and apply for government tenders through the GeM portal</p>
      </div>

      {/* Search and Filters Section */}
      <div style={STYLE.filterSection}>
        {/* Search Bar (The input triggering the debounced search) */}
        <div style={{ position: "relative", marginBottom: "15px", width: "95%"}}>
          <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
          <input
            type="text"
            placeholder="Search tenders by title, organization, or tender ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            style={{ ...STYLE.input, padding: "12px 15px 12px 45px" }}
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            backgroundColor: STYLE.secondaryColor,
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filters Dropdowns/Inputs */}
        {showFilters && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: "1px solid #eee"
          }}>
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

            <input
              type="text"
              placeholder="Organization"
              value={filters.organization}
              onChange={(e) => handleFilterChange("organization", e.target.value)}
              style={STYLE.input}
            />

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              style={STYLE.input}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Awarded">Awarded</option>
            </select>

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              style={STYLE.input}
            />
          </div>
        )}
      </div>

      {/* Tenders List */}
      <div style={{ marginBottom: "20px" }}>
        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        {tenders.length === 0 && !loading ? (
          <div style={{
            backgroundColor: "#fff",
            padding: "50px",
            borderRadius: "8px",
            textAlign: "center",
            color: "#666"
          }}>
            No tenders found matching your criteria.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {tenders.map((tender) => (
              <div key={tender._id} style={STYLE.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{tender.title}</h3>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "14px", color: "#666" }}>
                      <span><FaBuilding style={{ marginRight: "5px" }} />{tender.organization}</span>
                      <span><FaMapMarkerAlt style={{ marginRight: "5px" }} />{tender.location}</span>
                      <span><FaRupeeSign style={{ marginRight: "5px" }} />{formatCurrency(tender.estimatedValue)}</span>
                      <span><FaCalendarAlt style={{ marginRight: "5px" }} />**Deadline:** {formatDate(tender.applicationDeadline)}</span>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: getStatusColor(tender.status),
                    color: "#fff",
                    padding: "5px 12px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {tender.status}
                  </span>
                </div>

                <p style={{ color: "#555", marginBottom: "15px", lineHeight: "1.5" }}>
                  {tender.description?.substring(0, 200)}{tender.description && tender.description.length > 200 ? '...' : ''}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    <span>Tender ID: **{tender.tenderId}**</span>
                    <span style={{ marginLeft: "20px" }}>Category: **{tender.category || 'N/A'}**</span>
                  </div>
                  <button
                    onClick={() => applyToGem(tender)}
                    style={{
                      backgroundColor: STYLE.primaryColor,
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <FaExternalLinkAlt /> Apply on GeM
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "30px"
        }}>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={{
              padding: "10px 15px",
              border: "1px solid #ddd",
              backgroundColor: pagination.page === 1 ? "#f8f9fa" : "#fff",
              color: pagination.page === 1 ? "#999" : "#333",
              borderRadius: "5px",
              cursor: pagination.page === 1 ? "not-allowed" : "pointer"
            }}
          >
            Previous
          </button>

          <span style={{ color: "#666", fontSize: "14px" }}>
            Page **{pagination.page}** of **{pagination.pages}** (**{pagination.total}** total tenders)
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            style={{
              padding: "10px 15px",
              border: "1px solid #ddd",
              backgroundColor: pagination.page === pagination.pages ? "#f8f9fa" : "#fff",
              color: pagination.page === pagination.pages ? "#999" : "#333",
              borderRadius: "5px",
              cursor: pagination.page === pagination.pages ? "not-allowed" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Tenders;