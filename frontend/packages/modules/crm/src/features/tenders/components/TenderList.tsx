'use client';

import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiExternalLink, FiCalendar, FiDollarSign, FiBriefcase, FiMapPin, FiFilter, FiTag, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import apiClient from "@/core/api/client";

const TenderList = () => {
    const [tenders, setTenders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        organization: "",
        status: "",
        location: ""
    });
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const fetchTenders = useCallback(async (page: number, currentFilters: any) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', pagination.limit.toString());

            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value && value !== "") {
                    params.append(key, value as string);
                }
            });

            const response = await apiClient.get(`/tenders?${params.toString()}`);
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
            setError("Failed to load tenders. Please check your network connection.");
            setTenders([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.limit]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get("/tenders/categories/list");
            setCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    useEffect(() => {
        fetchTenders(1, filters);
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTenders(1, filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, fetchTenders]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchTenders(newPage, filters);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: any) => {
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) return 'Not Specified';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numericAmount);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700';
            case 'Closed': return 'bg-pink-50 text-pink-700';
            case 'Awarded': return 'bg-blue-50 text-blue-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="p-7.5 max-w-[1400px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-7.5 rounded-2xl shadow-lg mb-7.5 flex flex-col md:flex-row justify-between items-center border-none">
                <div>
                    <h1 className="m-0 mb-2 text-[32px] font-bold tracking-tight">Government Tenders</h1>
                    <p className="m-0 opacity-90 text-lg">Explore business opportunities through the GeM portal</p>
                </div>
                <button className="mt-4 md:mt-0 bg-white/20 text-white border border-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-white/30 transition-all cursor-pointer">
                    <FiClock /> Recent Only
                </button>
            </div>

            <div className="bg-white p-6.25 rounded-2xl shadow-sm border border-gray-100 mb-7.5">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search by title, organization, or ID..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-brand-primary focus:bg-white transition-all text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer w-full sm:w-auto justify-center ${showFilters ? "bg-brand-primary text-white shadow-lg shadow-brand-primary-dark/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 pt-5 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-brand-primary/20"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Organization</label>
                            <input
                                placeholder="ISRO, NHAI..."
                                value={filters.organization}
                                onChange={(e) => handleFilterChange("organization", e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-brand-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-brand-primary/20"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                                <option value="Awarded">Awarded</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Location</label>
                            <input
                                placeholder="City or State..."
                                value={filters.location}
                                onChange={(e) => handleFilterChange("location", e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-brand-primary/20"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-10">
                {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-5 border border-red-100">{error}</div>}

                {loading && tenders.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin mx-auto mb-5"></div>
                        <p className="text-gray-400 font-medium">Fetching latest tenders...</p>
                    </div>
                ) : tenders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-24 shadow-sm border border-gray-100 text-center text-gray-400">
                        <FiTag size={48} className="mx-auto mb-4 opacity-10" />
                        <h3 className="text-xl font-bold text-gray-800">No tenders found</h3>
                        <p className="max-w-[300px] mx-auto opacity-50">Try adjusting your search or filters to see more results.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tenders.map((tender) => (
                            <div key={tender._id} className="bg-white p-6.25 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-5">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2.5">
                                            <h3 className="m-0 text-xl font-bold text-gray-800 tracking-tight">{tender.title}</h3>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusStyle(tender.status)}`}>
                                                {tender.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-2"><FiBriefcase className="text-brand-primary" /> {tender.organization}</span>
                                            <span className="flex items-center gap-2"><FiMapPin className="text-brand-primary" /> {tender.location}</span>
                                            <span className="flex items-center gap-2 text-brand-primary"><FiDollarSign /> {formatCurrency(tender.estimatedValue)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.open('https://gem.gov.in/', '_blank')}
                                        className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary-dark/20 hover:bg-brand-primary-dark transition-all whitespace-nowrap"
                                    >
                                        <FiExternalLink /> View on GeM
                                    </button>
                                </div>

                                <p className="text-gray-500 text-sm leading-relaxed mb-5 border-l-4 border-gray-50 pl-4 py-1 italic">
                                    {tender.description?.substring(0, 200)}...
                                </p>

                                <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 gap-4">
                                    <div className="flex gap-6">
                                        <span className="flex items-center gap-2">ID: <b className="text-gray-600">{tender.tenderId}</b></span>
                                        <span className="flex items-center gap-2">Deadline: <b className="text-pink-500">{formatDate(tender.applicationDeadline)}</b></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-brand-primary">
                                        <FiClock /> Posted: {formatDate(tender.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-3 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <FiChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Page <b className="text-gray-800">{pagination.page}</b> / {pagination.pages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="p-3 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TenderList;
