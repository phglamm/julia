import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Star,
  Home,
  Globe,
  Building,
  Map,
  UserCircle,
} from "lucide-react";
import userService from "../../services/userService";
import { useUserStore } from "../../stores/userStore";

/* ─── helpers ──────────────────────────────────── */
const fmt = (v) => (v && v.toString().trim() ? v : null);
const fmtDate = (iso) => {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString("vi-VN"); }
  catch { return iso; }
};
const genderLabel = (g) => {
  if (!g) return null;
  return { male: "Nam", female: "Nữ", other: "Khác" }[g.toLowerCase()] ?? g;
};

/* ─── animation presets ──────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const tabContent = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

/* ─── InfoItem ───────────────────────────────────── */
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-gradient-to-br from-[#fdfaf7] to-[#f6f3e6] border border-[#ead2d8]/40 p-4">
      <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#c599a6] mb-1">
        <Icon size={11} />
        {label}
      </div>
      <div className={`text-sm font-medium ${value ? "text-[#682535]" : "text-[#c5a9b1] italic"}`}>
        {value ?? "Chưa cập nhật"}
      </div>
    </div>
  );
}

/* ─── FormField ──────────────────────────────────── */
function FormField({ icon: Icon, label, name, value, onChange, type = "text", children }) {
  const inputClass =
    "w-full px-4 py-3 border-2 border-[#ead2d8]/50 bg-gradient-to-br from-white to-[#fdfaf7] text-sm text-[#682535] outline-none focus:border-[#c599a6] focus:ring-2 focus:ring-[#c599a6]/15 transition-all placeholder:text-[#874d5f]/40 font-[inherit]";
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-[#682535]">
        <Icon size={12} />
        {label}
      </label>
      {children ?? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Nhập ${label.toLowerCase()}`}
          className={inputClass}
        />
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function ProfileScreen() {
  const updateUser = useUserStore((s) => s.updateUser);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [tab, setTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    fullName: "", phone: "", dob: "", gender: "",
    address: { street: "", ward: "", district: "", city: "", country: "Vietnam" },
  });

  /* ── fetch on mount ── */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await userService.getProfile();
        const data = res.data;
        setProfile(data);
        setForm({
          fullName: data.fullName ?? "",
          phone: data.phone ?? "",
          dob: data.dob ? data.dob.slice(0, 10) : "",
          gender: data.gender ?? "",
          address: {
            street: data.address?.street ?? "",
            ward: data.address?.ward ?? "",
            district: data.address?.district ?? "",
            city: data.address?.city ?? "",
            country: data.address?.country ?? "Vietnam",
          },
        });
      } catch (err) {
        setFetchError("Không thể tải thông tin. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ── form handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };
  const handleCancel = () => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? "",
        phone: profile.phone ?? "",
        dob: profile.dob ? profile.dob.slice(0, 10) : "",
        gender: profile.gender ?? "",
        address: {
          street: profile.address?.street ?? "",
          ward: profile.address?.ward ?? "",
          district: profile.address?.district ?? "",
          city: profile.address?.city ?? "",
          country: profile.address?.country ?? "Vietnam",
        },
      });
    }
    setSaveError("");
    setSaveSuccess(false);
    setTab("info");
  };
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const res = await userService.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        dob: form.dob || null,
        gender: form.gender,
        address: form.address,
      });
      const updated = res.data;
      setProfile(updated);
      updateUser(updated);
      setSaveSuccess(true);
      setTab("info");
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setSaveError(err?.response?.data?.message ?? "Cập nhật thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-[#f6f3e6] to-[#ead2d8] px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
          <div className="h-8 w-1/3 mx-auto bg-[#ead2d8] rounded" />
          <div className="h-40 bg-[#ead2d8] rounded" />
          <div className="h-64 bg-[#ead2d8] rounded" />
        </div>
      </div>
    );
  }

  /* ── Fetch error ── */
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-[#f6f3e6] to-[#ead2d8] px-6 py-12">
        <div className="max-w-3xl mx-auto flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertCircle size={18} />
          {fetchError}
        </div>
      </div>
    );
  }

  const addr = profile?.address ?? {};
  const inputClass =
    "w-full px-4 py-3 border-2 border-[#ead2d8]/50 bg-gradient-to-br from-white to-[#fdfaf7] text-sm text-[#682535] outline-none focus:border-[#c599a6] focus:ring-2 focus:ring-[#c599a6]/15 transition-all font-[inherit]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-[#f6f3e6] to-[#ead2d8] px-6 py-12 relative overflow-hidden">
      {/* decorative dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle,#682535 1px,transparent 1px)", backgroundSize: "40px 40px" }}
      />

      {/* ── Page heading ── */}
      <motion.div
        className="text-center mb-10 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#682535] tracking-tight">
          Tài Khoản Của Tôi
        </h1>
        <p className="text-[#874d5f] mt-1 text-sm">Quản lý thông tin cá nhân của bạn</p>
      </motion.div>

      {/* ── Success alert ── */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            className="max-w-3xl mx-auto mb-5 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle size={17} />
            Cập nhật thông tin thành công!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card ── */}
      <motion.div
        className="max-w-3xl mx-auto bg-white border border-[#ead2d8]/50 shadow-[0_8px_40px_rgba(104,37,53,0.08)] overflow-hidden relative z-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Hero strip ── */}
        <div className="bg-gradient-to-r from-[#682535] via-[#874d5f] to-[#682535] px-6 py-7 flex items-center gap-5">
          <motion.div className="relative shrink-0" whileHover={{ scale: 1.08 }}>
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-white">
              <User size={38} />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#c599a6] border-2 border-white flex items-center justify-center text-white">
              <Star size={11} fill="currentColor" />
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-white leading-tight truncate">
              {fmt(profile?.fullName) ?? profile?.username ?? "Người dùng Julia"}
            </div>
            <div className="text-white/70 text-sm mt-0.5 truncate">{profile?.email}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold capitalize">
                <Award size={11} />
                {profile?.role ?? "user"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#c599a6] to-[#a47784] text-white text-xs font-bold shadow-md">
                <Sparkles size={12} />
                {profile?.points ?? 0} điểm
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex border-b-2 border-[#ead2d8] mb-7 -mx-1">
            {[
              { key: "info", label: "Thông tin", Icon: User },
              { key: "edit", label: "Chỉnh sửa", Icon: Edit3 },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                id={`tab-${key}`}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-[3px] -mb-0.5 transition-all cursor-pointer
                  ${tab === key
                    ? "text-[#682535] border-[#682535]"
                    : "text-[#874d5f] border-transparent hover:text-[#682535]"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* ── INFO TAB ── */}
          <AnimatePresence mode="wait">
            {tab === "info" && (
              <motion.div key="info" variants={tabContent} initial="hidden" animate="visible" exit="exit">
                {/* Personal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoItem icon={User}     label="Họ và tên"       value={fmt(profile?.fullName)} />
                  <InfoItem icon={Mail}     label="Email"           value={profile?.email} />
                  <InfoItem icon={Phone}    label="Số điện thoại"   value={fmt(profile?.phone)} />
                  <InfoItem icon={Calendar} label="Ngày sinh"       value={fmtDate(profile?.dob)} />
                  <InfoItem icon={UserCircle} label="Giới tính"     value={genderLabel(profile?.gender)} />
                  <InfoItem icon={Star}     label="Tên đăng nhập"   value={profile?.username} />
                </div>

                {/* Address heading */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#874d5f] mt-7 mb-4 pb-2 border-b border-dashed border-[#ead2d8]">
                  <MapPin size={13} />
                  Địa chỉ
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoItem icon={Home}     label="Số nhà / Đường"  value={fmt(addr.street)} />
                  <InfoItem icon={Map}      label="Phường / Xã"     value={fmt(addr.ward)} />
                  <InfoItem icon={Building} label="Quận / Huyện"    value={fmt(addr.district)} />
                  <InfoItem icon={MapPin}   label="Thành phố"       value={fmt(addr.city)} />
                  <InfoItem icon={Globe}    label="Quốc gia"        value={fmt(addr.country)} />
                </div>

                {/* Edit CTA */}
                <div className="flex justify-end mt-8 pt-5 border-t border-[#ead2d8]">
                  <motion.button
                    id="btn-goto-edit"
                    onClick={() => setTab("edit")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#682535] to-[#874d5f] text-white text-sm font-bold shadow hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Edit3 size={14} />
                    Chỉnh sửa thông tin
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── EDIT TAB ── */}
            {tab === "edit" && (
              <motion.div key="edit" variants={tabContent} initial="hidden" animate="visible" exit="exit">
                {saveError && (
                  <div className="flex items-center gap-2 px-4 py-3 mb-5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    <AlertCircle size={17} />
                    {saveError}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField icon={User}     label="Họ và tên"       name="fullName" value={form.fullName}   onChange={handleChange} />
                    <FormField icon={Phone}    label="Số điện thoại"   name="phone"    value={form.phone}      onChange={handleChange} />
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField icon={Calendar} label="Ngày sinh" name="dob" type="date" value={form.dob} onChange={handleChange} />
                    <FormField icon={UserCircle} label="Giới tính" name="gender" value={form.gender} onChange={handleChange}>
                      <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                        <option value="">-- Chọn giới tính --</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Address heading */}
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#874d5f] mt-2 pb-2 border-b border-dashed border-[#ead2d8]">
                    <MapPin size={13} />
                    Địa chỉ
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField icon={Home}     label="Số nhà / Đường" name="street"   value={form.address.street}   onChange={handleAddressChange} />
                    <FormField icon={Map}      label="Phường / Xã"    name="ward"     value={form.address.ward}     onChange={handleAddressChange} />
                    <FormField icon={Building} label="Quận / Huyện"   name="district" value={form.address.district} onChange={handleAddressChange} />
                    <FormField icon={MapPin}   label="Thành phố"      name="city"     value={form.address.city}     onChange={handleAddressChange} />
                  </div>

                  <FormField icon={Globe} label="Quốc gia" name="country" value={form.address.country} onChange={handleAddressChange} />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-[#ead2d8]">
                  <motion.button
                    id="btn-cancel-edit"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border-2 border-[#ead2d8] text-[#874d5f] text-sm font-semibold hover:border-[#c599a6] hover:text-[#682535] transition-all cursor-pointer"
                  >
                    <X size={14} />
                    Hủy
                  </motion.button>
                  <motion.button
                    id="btn-save-profile"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={!saving ? { scale: 1.03 } : {}}
                    whileTap={!saving ? { scale: 0.97 } : {}}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c599a6] to-[#a47784] text-white text-sm font-bold shadow transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
                  >
                    {saving ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Sparkles size={14} />
                        </motion.div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Lưu thay đổi
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
