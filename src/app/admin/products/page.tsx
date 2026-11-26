"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Boxes,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  Package,
  X,
  Sparkles,
} from "lucide-react";
import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/lib/adminStore";
import { Product, AvailabilityStatus } from "@/types";
import { formatPrice } from "@/lib/utils";

const STATUS_OPTIONS: AvailabilityStatus[] = [
  "Available",
  "Coming Soon",
  "Out of Stock",
  "Discontinued",
];

const CATEGORY_OPTIONS = [
  { name: "Power & Charging", slug: "power-charging" },
  { name: "Audio", slug: "audio" },
  { name: "Mobile Devices", slug: "mobile-devices" },
  { name: "Accessories", slug: "accessories" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => getAdminProducts());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add / Edit form fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 35000,
    originalPrice: 40000,
    category: "Power & Charging",
    categorySlug: "power-charging",
    availabilityStatus: "Available" as AvailabilityStatus,
    stockQuantity: 100,
    heroImage: "/assets/products/powerbank-hero.png",
    featured: false,
    badge: "New Release",
    features: "Aerospace alloy casing\nDual bi-directional fast charge\nLED power gauge",
  });

  const [notification, setNotification] = useState("");

  const loadProducts = () => {
    setProducts(getAdminProducts());
  };

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getAdminProducts());
    };
    window.addEventListener("pax_admin_store_updated", handleUpdate);
    return () => window.removeEventListener("pax_admin_store_updated", handleUpdate);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      price: 35000,
      originalPrice: 40000,
      category: "Power & Charging",
      categorySlug: "power-charging",
      availabilityStatus: "Available",
      stockQuantity: 100,
      heroImage: "/assets/products/powerbank-hero.png",
      featured: false,
      badge: "Power Bank Flagship",
      features: "Aerospace-grade thermal management\nBi-directional USB-C fast charging\nAviation carry-on certified",
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      shortDescription: prod.shortDescription,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      category: prod.category,
      categorySlug: prod.categorySlug,
      availabilityStatus: prod.availabilityStatus,
      stockQuantity: prod.stockQuantity,
      heroImage: prod.heroImage,
      featured: prod.featured,
      badge: prod.badge || "",
      features: (prod.features || []).join("\n"),
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const featureList = formData.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const generatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const matchedCat = CATEGORY_OPTIONS.find((c) => c.name === formData.category);

    if (editingProduct) {
      updateAdminProduct(editingProduct.id, {
        name: formData.name,
        slug: generatedSlug,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || undefined,
        category: formData.category,
        categorySlug: matchedCat ? matchedCat.slug : formData.categorySlug,
        availabilityStatus: formData.availabilityStatus,
        stockQuantity: Number(formData.stockQuantity),
        heroImage: formData.heroImage,
        featured: formData.featured,
        badge: formData.badge || undefined,
        features: featureList,
      });
      showNotification(`Product "${formData.name}" successfully updated.`);
    } else {
      addAdminProduct({
        name: formData.name,
        slug: generatedSlug,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || undefined,
        category: formData.category,
        categorySlug: matchedCat ? matchedCat.slug : formData.categorySlug,
        availabilityStatus: formData.availabilityStatus,
        stockQuantity: Number(formData.stockQuantity),
        heroImage: formData.heroImage,
        images: [formData.heroImage],
        featured: formData.featured,
        badge: formData.badge || undefined,
        features: featureList,
        specifications: [
          { label: "Category", value: formData.category },
          { label: "Stock Level", value: `${formData.stockQuantity} Units` },
          { label: "Warranty", value: "12 Months Official Manufacturer Warranty" },
        ],
      });
      showNotification(`New product "${formData.name}" created and added to catalog.`);
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      deleteAdminProduct(productId);
      showNotification(`Product "${productName}" removed from catalog.`);
    }
  };

  const handleQuickStockChange = (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stockQuantity + delta);
    const newStatus = newStock === 0 ? "Out of Stock" : prod.availabilityStatus === "Out of Stock" ? "Available" : prod.availabilityStatus;
    updateAdminProduct(productId, { stockQuantity: newStock, availabilityStatus: newStatus });
  };

  const handleQuickStatusChange = (productId: string, newStatus: AvailabilityStatus) => {
    updateAdminProduct(productId, { availabilityStatus: newStatus });
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCat =
      selectedCategory === "All" || prod.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      prod.name.toLowerCase().includes(q) ||
      prod.category.toLowerCase().includes(q) ||
      prod.slug.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  const outOfStockCount = products.filter((p) => p.availabilityStatus === "Out of Stock" || p.stockQuantity === 0).length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#181a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>PRD Section 3.2 & 5.1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Add power banks, edit pricing, manage stock quantities, and availability states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono transition-colors shadow-[0_0_15px_rgba(0,230,118,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="text-[11px] font-mono text-neutral-400 uppercase">Total Items</div>
          <div className="text-xl font-bold text-white mt-1">{products.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Units In Stock</div>
          <div className="text-xl font-bold text-white mt-1">{totalStock}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="text-[11px] font-mono text-amber-400 uppercase">Power Banks</div>
          <div className="text-xl font-bold text-white mt-1">
            {products.filter((p) => p.categorySlug === "power-charging").length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="text-[11px] font-mono text-red-400 uppercase">Out of Stock</div>
          <div className="text-xl font-bold text-white mt-1">{outOfStockCount}</div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e1017] border border-[#1e2230] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-white text-black font-bold"
                : "bg-[#0e1017] text-neutral-400 hover:text-white border border-[#1c1f2b]"
            }`}
          >
            All Categories
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.name
                  ? "bg-cyan-500 text-black font-bold"
                  : "bg-[#0e1017] text-neutral-400 hover:text-white border border-[#1c1f2b]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#0c0d12] border border-[#1b1d27] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101218] border-b border-[#1a1d28] font-mono text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price (NGN)</th>
                <th className="px-5 py-3.5">Stock Level</th>
                <th className="px-5 py-3.5">Availability</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171922]">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#11131b] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#141620] border border-[#222533] overflow-hidden shrink-0 relative flex items-center justify-center">
                        {prod.heroImage ? (
                          <Image
                            src={prod.heroImage}
                            alt={prod.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-neutral-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{prod.name}</span>
                          {prod.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {prod.shortDescription}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          ID: {prod.id} • Slug: /{prod.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-[#13151f] border border-[#202330] text-[11px]">
                      {prod.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono">
                    <div className="font-bold text-white text-sm">
                      {formatPrice(prod.price)}
                    </div>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <div className="text-[10px] text-neutral-500 line-through">
                        {formatPrice(prod.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickStockChange(prod.id, -10)}
                        title="-10 units"
                        className="w-6 h-6 rounded bg-[#161822] hover:bg-[#202332] text-neutral-300 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-white min-w-[2.5rem] text-center">
                        {prod.stockQuantity}
                      </span>
                      <button
                        onClick={() => handleQuickStockChange(prod.id, 10)}
                        title="+10 units"
                        className="w-6 h-6 rounded bg-[#161822] hover:bg-[#202332] text-neutral-300 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono">
                    <select
                      value={prod.availabilityStatus}
                      onChange={(e) =>
                        handleQuickStatusChange(
                          prod.id,
                          e.target.value as AvailabilityStatus
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#141620] border border-[#222533] text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-2 rounded-lg bg-[#151722] hover:bg-[#1e202e] text-neutral-300 hover:text-white border border-[#252838] transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-2 rounded-lg bg-[#151722] hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-[#252838] transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0f15] border border-[#202433] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1b1e2a] pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                  Catalogue Configuration
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Add New Power Bank / Gadget"}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. UltraCharge 25000mAh Pro"
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Category (PRD §5.1)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Selling Price (NGN ₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Availability Status (PRD §5.1)
                  </label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availabilityStatus: e.target.value as AvailabilityStatus,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Product Hero Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    placeholder="/assets/products/powerbank-hero.png"
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Ultra-dense 100W dual-port power bank with thermal control"
                  className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Engineered for high performance..."
                  className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                  Bullet Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Aerospace grade alloy&#10;100W Power Delivery"
                  className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-[#161822] border-[#252838]"
                  />
                  <span>Display on Storefront Featured Carousel</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#1b1e2a]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#141620] hover:bg-[#1e202e] text-neutral-300 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono shadow-lg transition-colors"
                >
                  {editingProduct ? "Save Product Updates" : "Create Product in Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
