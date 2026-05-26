import { useEffect, useState } from "react";
import { Edit, Trash2, Save, X, Package } from "lucide-react";
import productService from "./../../services/productService";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editValues, setEditValues] = useState({
    title: "",
    shortDescription: "",
    brand: "",
    price: "",
    imageLink: "",
    details: {
      basicInfo: "",
      sizes: "",
      material: "",
      careInstructions: "",
      measurements: { length: "", waist: "", hip: "" },
    },
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await productService.getAllProducts();
      setProducts(resp.data.products || []);
    } catch (err) {
      setError(err.message || "Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
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
      toast.error("Xoá thất bại: " + (err.message || err));
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditValues({
      title: product.title || "",
      shortDescription: product.shortDescription || "",
      brand: product.brand || "",
      price: product.price || "",
      imageLink: product.imageLink || "",
      details: {
        basicInfo: product.details?.basicInfo || "",
        sizes: product.details?.sizes || "",
        material: product.details?.material || "",
        careInstructions: product.details?.careInstructions || "",
        measurements: {
          length: product.details?.measurements?.length || "",
          waist: product.details?.measurements?.waist || "",
          hip: product.details?.measurements?.hip || "",
        },
      },
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsCreating(true);
    setEditValues({
      title: "",
      shortDescription: "",
      brand: "",
      price: "",
      imageLink: "",
      details: {
        basicInfo: "",
        sizes: "",
        material: "",
        careInstructions: "",
        measurements: { length: "", waist: "", hip: "" },
      },
    });
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
    setIsCreating(false);
    setEditValues({
      title: "",
      shortDescription: "",
      brand: "",
      price: "",
      imageLink: "",
      details: {
        basicInfo: "",
        sizes: "",
        material: "",
        careInstructions: "",
        measurements: { length: "", waist: "", hip: "" },
      },
    });
  };

  const saveEdit = async () => {
    if (!selectedProduct) return;
    try {
      const payload = {
        title: editValues.title,
        shortDescription: editValues.shortDescription,
        brand: editValues.brand,
        price: Number(editValues.price),
        imageLink: editValues.imageLink,
        details: {
          basicInfo: editValues.details.basicInfo,
          sizes: editValues.details.sizes,
          material: editValues.details.material,
          careInstructions: editValues.details.careInstructions,
          measurements: {
            length: editValues.details.measurements.length,
            waist: editValues.details.measurements.waist,
            hip: editValues.details.measurements.hip,
          },
        },
      };

      await productService.updateProduct(selectedProduct._id, payload);

      setProducts((list) =>
        list.map((p) =>
          p._id === selectedProduct._id
            ? {
                ...p,
                ...payload,
                details: { ...p.details, ...payload.details },
                brand: payload.brand,
              }
            : p,
        ),
      );

      cancelEdit();
      toast.success("Cập nhật sản phẩm thành công");
    } catch (err) {
      toast.error("Cập nhật thất bại: " + (err.message || err));
    }
  };

  // Create product
  const createProduct = async () => {
    try {
      const payload = {
        title: editValues.title,
        shortDescription: editValues.shortDescription,
        brand: editValues.brand,
        price: Number(editValues.price),
        imageLink: editValues.imageLink,
        details: {
          basicInfo: editValues.details.basicInfo,
          sizes: editValues.details.sizes,
          material: editValues.details.material,
          careInstructions: editValues.details.careInstructions,
          measurements: {
            length: editValues.details.measurements.length,
            waist: editValues.details.measurements.waist,
            hip: editValues.details.measurements.hip,
          },
        },
      };

      const resp = await productService.createProduct(payload);
      const created = resp.data;
      setProducts((list) => [created, ...list]);
      toast.success("Tạo sản phẩm thành công");
      cancelEdit();
    } catch (err) {
      toast.error("Tạo sản phẩm thất bại: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Quản lý sản phẩm
                </h1>
                <p className="text-slate-500 mt-1">
                  {products.length} sản phẩm
                </p>
              </div>
            </div>
            <div>
              <button
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-sm font-medium"
                onClick={openCreateModal}
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-500"></div>
            <p className="mt-4 text-slate-600">Đang tải sản phẩm...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-800 font-medium">Lỗi: {error}</p>
            </div>
          </div>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Ảnh
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Kích cỡ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((p, idx) => (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={p.imageLink}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-200"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          {p.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(p.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {p.details?.sizes || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <>
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
                              onClick={() => openEditModal(p)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                              onClick={() => openDeleteModal(p)}
                              title="Xoá"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-semibold">Xoá sản phẩm</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    Bạn có chắc muốn xoá{" "}
                    <span className="font-medium">{selectedProduct.title}</span>
                    ?
                  </p>
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-slate-100 rounded"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedProduct(null);
                      }}
                    >
                      Huỷ
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded"
                      onClick={confirmDelete}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit / Create Modal */}
            {showEditModal && (isCreating || selectedProduct) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-2xl p-6 overflow-auto max-h-[90vh]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {isCreating ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
                    </h3>
                    <button className="p-1 text-slate-600" onClick={cancelEdit}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                    <label className="block">
                      <div className="text-xs text-slate-600">Tiêu đề</div>
                      <input
                        className="w-full mt-1 p-2 border rounded"
                        value={editValues.title}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            title: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="block">
                      <div className="text-xs text-slate-600">Thương hiệu</div>
                      <input
                        className="w-full mt-1 p-2 border rounded"
                        value={editValues.brand}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            brand: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="block">
                      <div className="text-xs text-slate-600">Mô tả ngắn</div>
                      <textarea
                        className="w-full mt-1 p-2 border rounded"
                        value={editValues.shortDescription}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            shortDescription: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label>
                        <div className="text-xs text-slate-600">Giá</div>
                        <input
                          type="number"
                          className="w-full mt-1 p-2 border rounded"
                          value={editValues.price}
                          onChange={(e) =>
                            setEditValues((v) => ({
                              ...v,
                              price: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <label>
                        <div className="text-xs text-slate-600">Ảnh (URL)</div>
                        <input
                          className="w-full mt-1 p-2 border rounded"
                          value={editValues.imageLink}
                          onChange={(e) =>
                            setEditValues((v) => ({
                              ...v,
                              imageLink: e.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div className="mt-2 border-t pt-2">
                      <div className="text-sm font-medium">Chi tiết</div>
                      <label className="block mt-2">
                        <div className="text-xs text-slate-600">
                          Thông tin cơ bản
                        </div>
                        <input
                          className="w-full mt-1 p-2 border rounded"
                          value={editValues.details.basicInfo}
                          onChange={(e) =>
                            setEditValues((v) => ({
                              ...v,
                              details: {
                                ...v.details,
                                basicInfo: e.target.value,
                              },
                            }))
                          }
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <label>
                          <div className="text-xs text-slate-600">Kích cỡ</div>
                          <input
                            className="w-full mt-1 p-2 border rounded"
                            value={editValues.details.sizes}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                details: {
                                  ...v.details,
                                  sizes: e.target.value,
                                },
                              }))
                            }
                          />
                        </label>
                        <label>
                          <div className="text-xs text-slate-600">
                            Chất liệu
                          </div>
                          <input
                            className="w-full mt-1 p-2 border rounded"
                            value={editValues.details.material}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                details: {
                                  ...v.details,
                                  material: e.target.value,
                                },
                              }))
                            }
                          />
                        </label>
                      </div>

                      <label className="block mt-2">
                        <div className="text-xs text-slate-600">
                          Hướng dẫn chăm sóc
                        </div>
                        <input
                          className="w-full mt-1 p-2 border rounded"
                          value={editValues.details.careInstructions}
                          onChange={(e) =>
                            setEditValues((v) => ({
                              ...v,
                              details: {
                                ...v.details,
                                careInstructions: e.target.value,
                              },
                            }))
                          }
                        />
                      </label>

                      <div className="mt-2 grid grid-cols-3 gap-3">
                        <label>
                          <div className="text-xs text-slate-600">Dài</div>
                          <input
                            className="w-full mt-1 p-2 border rounded"
                            value={editValues.details.measurements.length}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                details: {
                                  ...v.details,
                                  measurements: {
                                    ...v.details.measurements,
                                    length: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </label>
                        <label>
                          <div className="text-xs text-slate-600">Eo</div>
                          <input
                            className="w-full mt-1 p-2 border rounded"
                            value={editValues.details.measurements.waist}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                details: {
                                  ...v.details,
                                  measurements: {
                                    ...v.details.measurements,
                                    waist: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </label>
                        <label>
                          <div className="text-xs text-slate-600">Hông</div>
                          <input
                            className="w-full mt-1 p-2 border rounded"
                            value={editValues.details.measurements.hip}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                details: {
                                  ...v.details,
                                  measurements: {
                                    ...v.details.measurements,
                                    hip: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-slate-100 rounded"
                        onClick={cancelEdit}
                      >
                        Huỷ
                      </button>
                      {isCreating ? (
                        <button
                          className="px-4 py-2 bg-emerald-600 text-white rounded"
                          onClick={createProduct}
                        >
                          Tạo
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-emerald-600 text-white rounded"
                          onClick={saveEdit}
                        >
                          <Save className="w-4 h-4 inline-block mr-2" />
                          Lưu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  Chưa có sản phẩm
                </h3>
                <p className="text-slate-500">
                  Bắt đầu thêm sản phẩm vào cửa hàng của bạn
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
