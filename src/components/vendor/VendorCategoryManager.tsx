import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Image,
  Upload,
  Sparkles,
  ShoppingBag,
  Wrench,
  GraduationCap,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Shop, ShopCategory, ProductType } from '../../types';
import { CATEGORY_IMAGE_PRESETS, getCategoryImageByName } from '../../utils/categoryUtils';

interface VendorCategoryManagerProps {
  shop: Shop;
  onUpdateShop: (updatedShop: Shop) => void;
  showToast: (msg: string) => void;
}

export const VendorCategoryManager: React.FC<VendorCategoryManagerProps> = ({
  shop,
  onUpdateShop,
  showToast,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<ProductType | 'ALL'>('PRODUCT');
  const [formImage, setFormImage] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const categories: ShopCategory[] = shop.customCategories || [];

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    if (filterType === 'ALL') return true;
    return cat.type === filterType || cat.type === 'ALL';
  });

  // Calculate items per category
  const getItemCount = (catName: string, catType?: ProductType | 'ALL') => {
    const lower = (catName || '').trim().toLowerCase();
    return (shop.products || []).filter((p) => {
      const matchCat = (p.category || '').trim().toLowerCase() === lower;
      if (!matchCat) return false;
      if (catType && catType !== 'ALL' && p.type !== catType) return false;
      return true;
    }).length;
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormType(filterType === 'ALL' ? 'PRODUCT' : (filterType as ProductType));
    setFormImage('');
    setShowPresets(false);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (cat: ShopCategory) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormType(cat.type || 'PRODUCT');
    setFormImage(cat.imageUrl || '');
    setShowPresets(false);
    setIsAdding(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Kripya Category ka naam darj karein.');
      return;
    }

    const resolvedImage = formImage.trim() || getCategoryImageByName(formName.trim());

    let updatedList: ShopCategory[];

    if (editingId) {
      // Edit existing
      const oldCat = categories.find((c) => c.id === editingId);
      updatedList = categories.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: formName.trim(),
              type: formType,
              imageUrl: resolvedImage,
            }
          : c
      );

      // If category name changed, also update products that had the old category name
      let updatedProducts = shop.products;
      if (oldCat && oldCat.name.trim().toLowerCase() !== formName.trim().toLowerCase()) {
        const oldLower = oldCat.name.trim().toLowerCase();
        updatedProducts = shop.products.map((p) =>
          (p.category || '').trim().toLowerCase() === oldLower
            ? { ...p, category: formName.trim() }
            : p
        );
      }

      const updatedShop: Shop = {
        ...shop,
        customCategories: updatedList,
        products: updatedProducts,
      };

      onUpdateShop(updatedShop);
      showToast(`Category "${formName.trim()}" safaltapoorvak update ho gayi! ✨`);
    } else {
      // Check duplicate name
      const exists = categories.some(
        (c) => c.name.trim().toLowerCase() === formName.trim().toLowerCase()
      );
      if (exists) {
        showToast('Is naam ki category pehle se bani hui hai!');
        return;
      }

      const newCategory: ShopCategory = {
        id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: formName.trim(),
        type: formType,
        imageUrl: resolvedImage,
      };

      updatedList = [...categories, newCategory];

      const updatedShop: Shop = {
        ...shop,
        customCategories: updatedList,
      };

      onUpdateShop(updatedShop);
      showToast(`Nayi Category "${formName.trim()}" safalta se jud gayi! 🎉`);
    }

    setIsAdding(false);
    setEditingId(null);
    setFormName('');
    setFormImage('');
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (!window.confirm(`Kya aap category "${catName}" ko delete karna chahte hain?`)) {
      return;
    }

    const updatedList = categories.filter((c) => c.id !== catId);
    const updatedShop: Shop = {
      ...shop,
      customCategories: updatedList,
    };

    onUpdateShop(updatedShop);
    showToast(`Category "${catName}" delete ho gayi.`);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Photo ka size 2MB se kam hona chahiye.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
        showToast('Photo upload ho gayi!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Seed / extract categories from existing products if vendor hasn't created any yet
  const handleAutoExtractFromExisting = () => {
    const existingCats = new Map<string, { type: ProductType; img?: string }>();

    (shop.products || []).forEach((p) => {
      const cat = p.category?.trim();
      if (cat && !existingCats.has(cat.toLowerCase())) {
        existingCats.set(cat.toLowerCase(), {
          type: p.type || 'PRODUCT',
          img: p.imageUrl,
        });
      }
    });

    if (existingCats.size === 0) {
      showToast('Aapke catalogue mein koi category nahi mili.');
      return;
    }

    const newCustoms: ShopCategory[] = [];
    existingCats.forEach((val, lowerName) => {
      // Find proper capitalized name from item
      const item = (shop.products || []).find(
        (p) => (p.category || '').toLowerCase() === lowerName
      );
      const properName = item?.category?.trim() || lowerName;
      newCustoms.push({
        id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: properName,
        type: val.type,
        imageUrl: val.img || getCategoryImageByName(properName),
      });
    });

    const updatedShop: Shop = {
      ...shop,
      customCategories: [...categories, ...newCustoms],
    };
    onUpdateShop(updatedShop);
    showToast(`${newCustoms.length} Categories aapke saaman se auto-add ho gayi!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                Category Master (Name + Image)
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Apne Product, Service ya Course ke liye categories banayein aur photo upload karein.
              </p>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Website pe Desktop par ek line mein 10 categories aur Mobile par 5 show hoti hain. 10/5 se zyada hone par carousel chalta hai.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {categories.length === 0 && (shop.products || []).some((p) => p.category) && (
            <button
              type="button"
              onClick={handleAutoExtractFromExisting}
              className="px-3 py-2 rounded-xl border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Existing Items se Import</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nayi Category Banayein</span>
          </button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'Sabhi Categories', icon: Layers, count: categories.length },
          {
            id: 'PRODUCT',
            label: 'Products (Samaan)',
            icon: ShoppingBag,
            count: categories.filter((c) => c.type === 'PRODUCT' || c.type === 'ALL').length,
          },
          {
            id: 'SERVICE',
            label: 'Services (Seva)',
            icon: Wrench,
            count: categories.filter((c) => c.type === 'SERVICE' || c.type === 'ALL').length,
          },
          {
            id: 'COURSE',
            label: 'Courses (Training)',
            icon: GraduationCap,
            count: categories.filter((c) => c.type === 'COURSE' || c.type === 'ALL').length,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filterType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add / Edit Category Modal or Form */}
      {isAdding && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-orange-500 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                {editingId ? 'Edit Category (Badlav Karein)' : 'Nayi Category Banayein (Name + Image)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category Name */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name * (e.g. Ghee & Dairy, Sofa Cleaning, Tailoring Masterclass)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Desi Ghee, Wedding Sarees, Home Cleaning"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-bold"
                />
              </div>

              {/* Category Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Type * (Kiske liye hai?)
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as ProductType | 'ALL')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-bold cursor-pointer"
                >
                  <option value="PRODUCT">📦 Product (Physical Samaan)</option>
                  <option value="SERVICE">🛠️ Service (Ghar Seva / Booking)</option>
                  <option value="COURSE">🎓 Course (Training / Batch)</option>
                  <option value="ALL">🌐 All (Har Section mein dikhega)</option>
                </select>
              </div>
            </div>

            {/* Category Image Section */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Category Image (Photo URL ya File Upload) *
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Circular Preview */}
                <div className="relative w-16 h-16 rounded-full border-2 border-orange-500 overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                  {formImage || formName ? (
                    <img
                      src={formImage || getCategoryImageByName(formName)}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Image className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Photo URL darj karein (https://...)"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />

                    <label className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className="px-3 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Presets</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    Agar aap photo nahi dalenge toh category naam ke hisab se automatic sundar photo lag jayegi.
                  </p>
                </div>
              </div>

              {/* Photo Preset Gallery */}
              {showPresets && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-gray-600">
                      Click karein photo select karne ke liye:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPresets(false)}
                      className="text-[10px] text-gray-400 hover:text-gray-600"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-1">
                    {Object.entries(CATEGORY_IMAGE_PRESETS).map(([key, url]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setFormImage(url);
                          setShowPresets(false);
                        }}
                        className="group flex flex-col items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-white transition"
                        title={key}
                      >
                        <img
                          src={url}
                          alt={key}
                          className="w-10 h-10 object-cover rounded-full border border-gray-200 group-hover:border-orange-500 group-hover:scale-105 transition"
                        />
                        <span className="text-[9px] text-gray-600 truncate w-full text-center capitalize">
                          {key}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Update Category' : 'Save Category'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid / Cards List */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Abhi koi category nahi bani hui hai
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              "Nayi Category Banayein" button par click karke Category Name aur Photo add karein. Uske baad product add karte waqt aap direct select kar sakenge.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pehli Category Banayein</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredCategories.map((cat) => {
            const count = getItemCount(cat.name, cat.type);
            const img = cat.imageUrl || getCategoryImageByName(cat.name);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-3.5 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition group relative"
              >
                {/* Category Type Badge */}
                <span
                  className={`self-start text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-2 ${
                    cat.type === 'SERVICE'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : cat.type === 'COURSE'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}
                >
                  {cat.type === 'SERVICE' ? 'Service' : cat.type === 'COURSE' ? 'Course' : 'Product'}
                </span>

                {/* Circular Image */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 border-2 border-orange-500/80 shadow-2xs mb-2 group-hover:scale-105 transition-transform duration-200 bg-white">
                  <img
                    src={img}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full bg-gray-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                    {count} items
                  </span>
                </div>

                {/* Category Name */}
                <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 mt-1 font-['Outfit',sans-serif]">
                  {cat.name}
                </h4>

                {/* Actions: Edit / Delete */}
                <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-100 w-full justify-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete Category"
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
  );
};
