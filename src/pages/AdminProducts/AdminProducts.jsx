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
const RENTAL_TYPE_OPTIONS = [
  { value: "fixed", label: "Trọn gói" },
  { value: "per_day", label: "Theo ngày" },
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
  rentalType: "fixed",
  rentalPrice: "",
  depositAmount: "",
  stock: 1,
  isAvailable: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
      brand: product.brand || "",
      condition: product.condition || "new",
      rentalType: product.rentalType || "fixed",
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
    brand: editValues.brand,
    condition: editValues.condition,
    rentalType: editValues.rentalType,
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
    if (!editValues.title || !editValues.size || !editValues.rentalType || !editValues.rentalPrice) {
      toast.error("Vui lòng điền các trường bắt buộc (Tiêu đề, Kích cỡ, Loại thuê, Giá thuê)");
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

  /* ─── Form field helper ────────────────────────────────── */
  const Field = ({ label, required, children, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all";
  const selectClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white";

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      {/* ── Header Card ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý sản phẩm
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {products.length} sản phẩm
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search */}
        <div className="mt-5 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────────── */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Đang tải sản phẩm...</p>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
            <p className="text-red-700 text-sm font-medium">Lỗi: {error}</p>
          </div>
        </div>
      )}

      {/* ── Products Table ─────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-50/80 border-b border-gray-100">
                  {[
                    "STT",
                    "Ảnh",
                    "Tên sản phẩm",
                    "Danh mục",
                    "Kích cỡ",
                    "Giá thuê",
                    "Tình trạng",
                    "Kho",
                    "Hành động",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${
                        i === 8 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p, idx) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 text-sm text-gray-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-xl shadow-sm border border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {p.title}
                      </p>
                      {p.brand && (
                        <p className="text-xs text-gray-500 mt-0.5">{p.brand}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {typeof p.category === "object"
                          ? p.category?.name || "—"
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">
                        {p.size}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {fmt(p.rentalPrice)}
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {p.rentalType === "per_day" ? "/ngày" : "trọn gói"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${conditionColor(
                          p.condition
                        )}`}
                      >
                        {conditionLabel(p.condition)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {p.stock}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.isAvailable ? "bg-emerald-500" : "bg-red-400"
                          }`}
                          title={p.isAvailable ? "Còn hàng" : "Hết hàng"}
                        ></span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          onClick={() => openEditModal(p)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
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

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                <Package className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Chưa có sản phẩm
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Bắt đầu thêm sản phẩm vào cửa hàng của bạn
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Xoá sản phẩm</h3>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc muốn xoá{" "}
                <span className="font-semibold text-gray-900">
                  "{selectedProduct.title}"
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
              >
                Huỷ
              </button>
              <button
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
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
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={cancelEdit}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isCreating ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
                </h3>
              </div>
              <button
                onClick={cancelEdit}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
              {/* ── Section: Basic Info ─────────────────────── */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Thông tin cơ bản
                </h4>
                <div className="space-y-4">
                  <Field label="Tiêu đề" required>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="VD: Áo dài lụa đỏ"
                      value={editValues.title}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, title: e.target.value }))
                      }
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Mô tả ngắn">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Mô tả ngắn gọn..."
                        value={editValues.shortDescription}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            shortDescription: e.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Thương hiệu">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="VD: Julia"
                        value={editValues.brand}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, brand: e.target.value }))
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Mô tả chi tiết">
                    <textarea
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Mô tả đầy đủ về sản phẩm..."
                      value={editValues.description}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </section>

              {/* ── Section: Images ────────────────────────── */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-violet-500 rounded-full"></div>
                  Hình ảnh
                </h4>
                {/* Preview */}
                {editValues.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {editValues.images.map((url, i) => (
                      <div
                        key={i}
                        className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                      >
                        <img
                          src={url}
                          alt={`img-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`${inputClass} flex-1`}
                    placeholder="Dán URL hình ảnh..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl transition-colors text-sm font-medium shrink-0"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* ── Section: Clothing Attributes ───────────── */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                  Thuộc tính sản phẩm
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Field label="Danh mục">
                    <select
                      className={selectClass}
                      value={editValues.category}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, category: e.target.value }))
                      }
                    >
                      <option value="">— Không chọn —</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Kích cỡ" required>
                    <select
                      className={selectClass}
                      value={editValues.size}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, size: e.target.value }))
                      }
                    >
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Màu sắc">
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="VD: Đỏ, Xanh..."
                      value={editValues.color}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, color: e.target.value }))
                      }
                    />
                  </Field>
                  <Field label="Chất liệu">
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="VD: Lụa, Vải cotton..."
                      value={editValues.material}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          material: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Giới tính">
                    <select
                      className={selectClass}
                      value={editValues.gender}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, gender: e.target.value }))
                      }
                    >
                      {GENDER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tình trạng">
                    <select
                      className={selectClass}
                      value={editValues.condition}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          condition: e.target.value,
                        }))
                      }
                    >
                      {CONDITION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>

              {/* ── Section: Rental Pricing ────────────────── */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                  Giá thuê
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Loại thuê" required>
                    <div className="flex gap-2">
                      {RENTAL_TYPE_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() =>
                            setEditValues((v) => ({
                              ...v,
                              rentalType: o.value,
                            }))
                          }
                          className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                            editValues.rentalType === o.value
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Giá thuê (VNĐ)" required>
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      placeholder="VD: 350000"
                      value={editValues.rentalPrice}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          rentalPrice: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Tiền cọc (VNĐ)">
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      placeholder="VD: 500000"
                      value={editValues.depositAmount}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          depositAmount: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </section>

              {/* ── Section: Stock & Availability ──────────── */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
                  Kho & Trạng thái
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Số lượng tồn kho">
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      value={editValues.stock}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          stock: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <div className="flex items-end pb-1">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Sẵn sàng cho thuê
                        </p>
                        <p className="text-xs text-gray-500">
                          {editValues.isAvailable
                            ? "Sản phẩm đang hiển thị"
                            : "Sản phẩm đã ẩn"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditValues((v) => ({
                            ...v,
                            isAvailable: !v.isAvailable,
                          }))
                        }
                        className={`relative w-12 h-7 rounded-full transition-colors ${
                          editValues.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                            editValues.isAvailable
                              ? "translate-x-5.5"
                              : "translate-x-0.5"
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
              <button
                onClick={cancelEdit}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={isCreating ? createProduct : saveEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
