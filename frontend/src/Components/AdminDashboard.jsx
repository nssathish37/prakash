import React, { useEffect, useState, useMemo } from "react";
import {
  Package, DollarSign, ShoppingBag, Edit3, Trash2, Plus, Search, 
  CheckCircle, Download, LayoutGrid, Users, BarChart3, Settings, 
  LogOut, Bell, Menu, X, Filter, ChevronRight, TrendingUp, MoreVertical,
  ShieldCheck, CreditCard, PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

// Simulation of initial data
import allProductsData from "../../DB/allProduct.json";

export default function AdminDashboard() {
  // --- 1. AUTH & ROLE STATE ---
  const [user, setUser] = useState({ name: "Admin User", role: "Super Admin", avatar: "https://ui-avatars.com/api/?name=Admin" });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // --- 2. DATA STATES ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = localStorage.getItem("adminToken");

  
  // --- 3. UI STATES ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discount_price: "",
  stock: "",
  rating: 0,
  reviews_count: 0,
  image_url: "",
  is_active: true,
  created_at: new Date().toISOString().split('T')[0] // Default to today
});
  

  // --- 4. ANALYTICS DATA (Mock) ---
  const salesData = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Shipped', value: 200 },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#6366f1'];

   useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products/");

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setProducts(data);
      setLoading(false);

    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  fetchProducts();
}, []);


  // --- 5. LOGIC HELPERS ---
  const stats = useMemo(() => {
    const totalRev = products.reduce((s, p) => s + (Number(p.price) || 0), 0);
    return [
      { title: "Total Revenue", value: `₹${totalRev.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: "Active Orders", value: "1,284", icon: ShoppingBag, trend: "+3.2%", color: "text-blue-600", bg: "bg-blue-50" },
      { title: "Total Users", value: "8,942", icon: Users, trend: "+18%", color: "text-purple-600", bg: "bg-purple-50" },
      { title: "Stock Units", value: products.length, icon: Package, trend: "-2%", color: "text-amber-600", bg: "bg-amber-50" },
    ];
  }, [products]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const handleSaveProduct = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Admin not logged in");

    const url = isEditing
      ? `http://localhost:8000/api/products/${formData.id}/`
      : "http://localhost:8000/api/products/";

    const method = isEditing ? "PUT" : "POST";

    // ✅ CREATE FORMDATA
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        form.append(key, formData[key]);
      }
    });

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Token ${token}`, // ❗ DO NOT SET Content-Type
      },
      body: form,
    });

    if (!res.ok) throw new Error("Save failed");

    const savedProduct = await res.json();

    setProducts((prev) =>
      isEditing
        ? prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        : [savedProduct, ...prev]
    );

    setShowModal(false);
    setIsEditing(false);

    alert(isEditing ? "✏️ Product updated" : "✅ Product added");
  } catch (err) {
    console.error(err);
    alert("❌ Error saving product");
  }
};



const handleDeleteProduct = async (id) => {
  if (!window.confirm("❗ Delete this product?")) return;

  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(`http://localhost:8000/api/products/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    // 🔥 Remove from UI instantly
    setProducts(prev => prev.filter(p => p.id !== id));

    alert("🗑️ Product deleted successfully");

  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete product");
  }
};

const handleEditClick = (product) => {
  setFormData({
    ...product,
  });
  setIsEditing(true);
  setShowModal(true);
};




const handleLogout = () => {
  if(window.confirm("Logout from system?")) setIsAuthenticated(false);
};


  if (!isAuthenticated) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <h2 className="text-3xl font-black text-slate-900 italic">PRAKASH TRADERS</h2>
        <p className="mt-2 text-slate-500 font-medium">Please sign in to access management.</p>
        <button onClick={() => setIsAuthenticated(true)} className="mt-8 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Sign In to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 hidden md:block`}>
        <div className="flex h-full flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white"><Package size={24}/></div>
            {sidebarOpen && <span className="text-xl font-black tracking-tighter">PRAKASH TRADERS</span>}
          </div>

          <nav className="flex-1 space-y-1 px-4 mt-4">
            {[
              { name: 'Dashboard', icon: BarChart3 },
              { name: 'Products', icon: LayoutGrid },
              { name: 'Orders', icon: ShoppingBag },
              { name: 'Customers', icon: Users },
              { name: 'Payments', icon: CreditCard },
              { name: 'Settings', icon: Settings }
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-all ${activeTab === item.name ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-50 transition-all">
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-bold">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={20}/></button>
            <h2 className="text-lg font-bold text-slate-800">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-6">
           
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20}/>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{user.name}</p>
                <p className="text-[10px] font-medium text-indigo-600">{user.role}</p>
              </div>
              <img src={user.avatar} className="h-9 w-9 rounded-full bg-slate-200 ring-2 ring-indigo-50"/>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "Dashboard" ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="group rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-2xl ${stat.bg} ${stat.color} p-3`}>
                        <stat.icon size={22} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black tracking-tight">Revenue Analysis</h3>
                    <select className="bg-slate-50 text-[10px] font-bold uppercase p-2 rounded-lg outline-none">
                      <option>Last 6 Months</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-lg font-black tracking-tight mb-8">Order Status</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={orderStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-3">
                    {orderStatusData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                          <span className="text-xs font-medium text-slate-500">{d.name}</span>
                        </div>
                        <span className="text-xs font-bold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* --- PRODUCT LIST TAB --- */
            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="w-full rounded-xl border-none bg-slate-100 py-3 pl-11 pr-4 text-sm font-medium outline-none ring-2 ring-transparent focus:ring-indigo-100 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFormData({ name: "", category: "", price: "", image_url: null, in_stock: true }); setIsEditing(false); setShowModal(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                    <Plus size={18}/> Add Item
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-8 py-5">Product Info</th>
                      <th className="px-6 py-5">Type</th>
                      <th className="px-6 py-5">Price</th>
                      <th className="px-6 py-5">Inventory Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={p.image_url} className="h-12 w-12 rounded-xl object-cover bg-slate-100 border border-slate-100" onError={(e) => e.target.src="https://via.placeholder.com/100"} alt=""/>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                              <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase">ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{p.category}</span>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-800">${p.price}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase ${p.in_stock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.in_stock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {p.in_stock ? 'Ready' : 'Out'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              >
                                <Edit3 size={16}/>
                              </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                <Trash2 size={16}/>
                              </button>                       
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- FORM MODAL --- */}
     {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
    <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900">{isEditing ? "Edit Product" : "Add New Product"}</h3>
          <p className="text-slate-500 text-xs font-medium">Fill in the product catalog details.</p>
        </div>
        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <form  onSubmit={handleSaveProduct} className="p-8 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar ">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Product Name</label>
            <input required className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Brand</label>
            <input className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
              value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description</label>
          <textarea rows="2" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Price (₹)</label>
            <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
              value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discount (₹)</label>
            <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold text-rose-500" 
              value={formData.discount_price} onChange={(e) => setFormData({...formData, discount_price: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock Qty</label>
            <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
              value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
            <input className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
              value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          </div>
        </div>

        {/* Ratings & Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rating (0-5)</label>
            <input type="number" step="0.1" max="5" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
              value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Review Count</label>
            <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold" 
              value={formData.reviews_count} onChange={(e) => setFormData({...formData, reviews_count: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Created At</label>
            <input type="date" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold text-slate-500" 
              value={formData.created_at} onChange={(e) => setFormData({...formData, created_at: e.target.value})} />
          </div>
        </div>
<div className="space-y-1">
  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
    Product Image
  </label>

  <div className="flex items-center gap-3">
    {/* File Input */}
    <input
      type="file"
      accept="image/*"
      className="flex-1 rounded-xl bg-slate-100 border-none p-3 text-sm font-bold cursor-pointer"
      onChange={(e) =>
        setFormData({
          ...formData,
          image: e.target.files[0], // 👈 FILE OBJECT
        })
      }
    />

    {/* Preview */}
    {formData.image && (
      <img
        src={
          typeof formData.image === "string"
            ? `http://localhost:8000${formData.image}` // edit mode
            : URL.createObjectURL(formData.image) // new upload
        }
        className="w-11 h-11 rounded-lg object-cover border"
        alt="preview"
      />
    )}
  </div>
</div>


        <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_active" className="h-5 w-5 rounded-lg accent-indigo-600" 
              checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
            <label htmlFor="is_active" className="text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Active on Website</label>
          </div>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${formData.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'}`}>
            {formData.is_active ? "LIVE" : "DRAFT"}
          </span>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            Save Product
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}