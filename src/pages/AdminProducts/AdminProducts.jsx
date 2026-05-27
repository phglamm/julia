import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Plus,
  Search,
  ImagePlus,
  XCircle,
} from "lucide-react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import brandService from "../../services/brandService";
import toast from "react-hot-toast";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "unisex", label: "Unisex" },
];
const CONDITION_OPTIONS = [
  { value: "new", label: "Mới" },
  { value: "like_new", label: "Như mới" },
  { value: "good", label: "Tốt" },
  { value: "fair", label: "Khá" },
];

const emptyForm = {
  title: "",
  shortDescription: "",
  description: "",
  images: [],
  category: "",
  size: "M",
  color: "",
  material: "",
  gender: "unisex",
  brand: "",
  condition: "new",
  rentalPrice: "",
  depositAmount: "",
  stock: 1,
  isAvailable: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState({ ...emptyForm });
  const [newImageUrl, setNewImageUrl] = useState("");

  /* ─── Fetch data ────────────────────────────────────────── */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await productService.getAllProducts({
        limit: 100,
        ...(searchTerm ? { searchTerm } : {}),
      });
      setProducts(resp.data.products || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const resp = await categoryService.getAllCategories();
      setCategories(resp.data || []);
    } catch {
      /* silent – dropdown will be empty */
    }
  };

  const fetchBrands = async () => {
    try {
      const resp = await brandService.getAllBrands();
      setBrands(resp.data || []);
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  /* ─── Helpers ───────────────────────────────────────────── */
  const fmt = (n) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      n || 0
    );

  const conditionLabel = (v) =>
    CONDITION_OPTIONS.find((o) => o.value === v)?.label || v;

  const conditionColor = (v) => {
    const map = {
      new: "bg-emerald-50 text-emerald-700",
      like_new: "bg-blue-50 text-blue-700",
      good: "bg-amber-50 text-amber-700",
      fair: "bg-gray-100 text-gray-600",
    };
    return map[v] || "bg-gray-100 text-gray-600";
  };

  /* ─── Modal openers ────────────────────────────────────── */
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsCreating(false);
    setEditValues({
      title: product.title || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      images: product.images || [],
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      size: product.size || "M",
      color: product.color || "",
      material: product.material || "",
      gender: product.gender || "unisex",
      brand:
        typeof product.brand === "object"
          ? product.brand?._id || ""
          : product.brand || "",
      condition: product.condition || "new",
      rentalPrice: product.rentalPrice || "",
      depositAmount: product.depositAmount || "",
      stock: product.stock ?? 1,
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsCreating(true);
    setEditValues({ ...emptyForm });
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
    setIsCreating(false);
    setEditValues({ ...emptyForm });
    setNewImageUrl("");
  };

  /* ─── Image list management ────────────────────────────── */
  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setEditValues((v) => ({ ...v, images: [...v.images, url] }));
    setNewImageUrl("");
  };

  const removeImage = (idx) => {
    setEditValues((v) => ({
      ...v,
      images: v.images.filter((_, i) => i !== idx),
    }));
  };

  /* ─── CRUD Actions ─────────────────────────────────────── */
  const buildPayload = () => ({
    title: editValues.title,
    shortDescription: editValues.shortDescription,
    description: editValues.description,
    images: editValues.images,
    category: editValues.category || null,
    size: editValues.size,
    color: editValues.color,
    material: editValues.material,
    gender: editValues.gender,
    brand: editValues.brand || null,
    condition: editValues.condition,
    rentalPrice: Number(editValues.rentalPrice),
    depositAmount: Number(editValues.depositAmount) || 0,
    stock: Number(editValues.stock) || 1,
    isAvailable: editValues.isAvailable,
  });

  const saveEdit = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      const resp = await productService.updateProduct(selectedProduct._id, payload);
      setProducts((list) =>
        list.map((p) => (p._id === selectedProduct._id ? resp.data : p))
      );
      cancelEdit();
      toast.success("Cập nhật sản phẩm thành công");
    } catch (err) {
      toast.error(
        "Cập nhật thất bại: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  const createProduct = async () => {
    if (!editValues.title || !editValues.size || !editValues.rentalPrice || !editValues.depositAmount) {
      toast.error("Vui lòng điền các trường bắt buộc (Tiêu đề, Kích cỡ, Phí thuê, Giá trị sản phẩm)");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const resp = await productService.createProduct(payload);
      setProducts((list) => [resp.data, ...list]);
      toast.success("Tạo sản phẩm thành công");
      cancelEdit();
    } catch (err) {
      toast.error(
        "Tạo sản phẩm thất bại: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await productService.deleteProduct(selectedProduct._id);
      setProducts((p) => p.filter((x) => x._id !== selectedProduct._id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      toast.success("Xoá sản phẩm thành công");
    } catch (err) {
      toast.error("Xoá thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  /* ─── Shared classes ───────────────────────────────────── */
  const inputCls =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
  const selectCls = `${inputCls} bg-white`;

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý sản phẩm</h1>
              <p className="text-xs text-gray-500 mt-0.5">{products.length} sản phẩm</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-indigo-600"></div>
          <p className="mt-3 text-gray-500 text-sm">Đang tải sản phẩm...</p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">Lỗi: {error}</p>
        </div>
      )}

      {/* ── Products Table ───────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["STT","Ảnh","Tên sản phẩm","Danh mục","Kích cỡ","Giá thuê","Tình trạng","Kho",""].map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${
                        i === 8 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p, idx) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      {p.images?.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</p>
                      {p.brand && <p className="text-xs text-gray-400 mt-0.5">{typeof p.brand === 'object' ? p.brand.name : p.brand}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {typeof p.category === "object" ? p.category?.name || "—" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded">
                        {p.size}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{fmt(p.rentalPrice)}</span>
                      <span className="text-xs text-gray-400 block">
                        / ngày
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${conditionColor(p.condition)}`}>
                        {conditionLabel(p.condition)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-700">{p.stock}</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? "bg-emerald-500" : "bg-red-400"}`}
                          title={p.isAvailable ? "Còn hàng" : "Hết hàng"}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => openEditModal(p)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => openDeleteModal(p)}
                          title="Xoá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {products.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-3">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Chưa có sản phẩm</h3>
              <p className="text-gray-500 text-sm mb-5">Bắt đầu thêm sản phẩm vào cửa hàng của bạn</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ DELETE MODAL ═══════════════════════ */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
          />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Xoá sản phẩm</h3>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc muốn xoá{" "}
                <span className="font-semibold text-gray-900">"{selectedProduct.title}"</span>?
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-2 px-6 pb-5">
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
              >
                Huỷ
              </button>
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                onClick={confirmDelete}
              >
                Xác nhận xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ CREATE / EDIT MODAL ═══════════════ */}
      {showEditModal && (isCreating || selectedProduct) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40" onClick={cancelEdit} />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-600 rounded-md">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {isCreating ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
                </h3>
              </div>
              <button onClick={cancelEdit} className="p-1.5 hover:bg-gray-100 rounded-md">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section: Basic Info */}
              <section>
                <SectionTitle color="bg-indigo-500">Thông tin cơ bản</SectionTitle>
                <div className="space-y-3 mt-3">
                  <Field label="Tiêu đề" required>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="VD: Áo dài lụa đỏ"
                      value={editValues.title}
                      onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Mô tả ngắn">
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="Mô tả ngắn gọn..."
                        value={editValues.shortDescription}
                        onChange={(e) => setEditValues((v) => ({ ...v, shortDescription: e.target.value }))}
                      />
                    </Field>
                    <Field label="Thương hiệu">
                      <select className={selectCls} value={editValues.brand} onChange={(e) => setEditValues((v) => ({ ...v, brand: e.target.value }))}>
                        <option value="">— Không chọn —</option>
                        {brands.map((b) => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Mô tả chi tiết">
                    <textarea
                      rows={3}
                      className={`${inputCls} resize-none`}
                      placeholder="Mô tả đầy đủ về sản phẩm..."
                      value={editValues.description}
                      onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                    />
                  </Field>
                </div>
              </section>

              {/* Section: Images */}
              <section>
                <SectionTitle color="bg-violet-500">Hình ảnh</SectionTitle>
                {editValues.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mb-3">
                    {editValues.images.map((url, i) => (
                      <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <XCircle className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    className={`${inputCls} flex-1`}
                    placeholder="Dán URL hình ảnh..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-sm shrink-0"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* Section: Attributes */}
              <section>
                <SectionTitle color="bg-amber-500">Thuộc tính sản phẩm</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  <Field label="Danh mục">
                    <select className={selectCls} value={editValues.category} onChange={(e) => setEditValues((v) => ({ ...v, category: e.target.value }))}>
                      <option value="">— Không chọn —</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Kích cỡ" required>
                    <select className={selectCls} value={editValues.size} onChange={(e) => setEditValues((v) => ({ ...v, size: e.target.value }))}>
                      {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Màu sắc">
                    <input type="text" className={inputCls} placeholder="VD: Đỏ, Xanh..." value={editValues.color} onChange={(e) => setEditValues((v) => ({ ...v, color: e.target.value }))} />
                  </Field>
                  <Field label="Chất liệu">
                    <input type="text" className={inputCls} placeholder="VD: Lụa, Vải cotton..." value={editValues.material} onChange={(e) => setEditValues((v) => ({ ...v, material: e.target.value }))} />
                  </Field>
                  <Field label="Giới tính">
                    <select className={selectCls} value={editValues.gender} onChange={(e) => setEditValues((v) => ({ ...v, gender: e.target.value }))}>
                      {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Tình trạng">
                    <select className={selectCls} value={editValues.condition} onChange={(e) => setEditValues((v) => ({ ...v, condition: e.target.value }))}>
                      {CONDITION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </div>
              </section>

              {/* Section: Pricing */}
              <section>
                <SectionTitle color="bg-emerald-500">Chi phí thuê & Cọc</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <Field label="Phí thuê (VNĐ / ngày)" required>
                    <input
                      type="number"
                      min="0"
                      className={inputCls}
                      placeholder="VD: 350000"
                      value={editValues.rentalPrice}
                      onChange={(e) => setEditValues((v) => ({ ...v, rentalPrice: e.target.value }))}
                    />
                  </Field>
                  <Field label="Giá trị sản phẩm (để thu cọc)" required>
                    <input
                      type="number"
                      min="0"
                      className={inputCls}
                      placeholder="VD: 200000"
                      value={editValues.depositAmount}
                      onChange={(e) => setEditValues((v) => ({ ...v, depositAmount: e.target.value }))}
                    />
                  </Field>
                </div>
              </section>

              {/* Section: Stock */}
              <section>
                <SectionTitle color="bg-rose-500">Kho & Trạng thái</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <Field label="Số lượng tồn kho">
                    <input
                      type="number"
                      min="0"
                      className={inputCls}
                      value={editValues.stock}
                      onChange={(e) => setEditValues((v) => ({ ...v, stock: e.target.value }))}
                    />
                  </Field>
                  <div className="flex items-end">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg w-full border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Sẵn sàng cho thuê</p>
                        <p className="text-xs text-gray-500">
                          {editValues.isAvailable ? "Đang hiển thị" : "Đã ẩn"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditValues((v) => ({ ...v, isAvailable: !v.isAvailable }))}
                        className={`relative w-10 h-6 rounded-full ${
                          editValues.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm ${
                            editValues.isAvailable ? "left-[18px]" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Huỷ
              </button>
              <button
                onClick={isCreating ? createProduct : saveEdit}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isCreating ? "Tạo sản phẩm" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Reusable sub-components ─────────────────────────────── */
function SectionTitle({ color, children }) {
  return (
    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
      <div className={`w-1 h-3.5 ${color} rounded-full`} />
      {children}
    </h4>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
