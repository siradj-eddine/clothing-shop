'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';
import { Category } from '@/lib/types';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await productsApi.getAllCategories();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error(t('admin.failedToLoadCategories'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        await productsApi.updateCategory(editingCategory.slug, formData);
        toast.success(t('admin.categoryUpdated'));
      } else {
        await productsApi.createCategory(formData);
        toast.success(t('admin.categoryCreated'));
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('admin.failedToSaveCategory'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(t('admin.confirmDeleteCategory', { name: category.name }))) {
      return;
    }

    try {
      await productsApi.deleteCategory(category.slug);
      toast.success(t('admin.categoryDeleted'));
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('admin.failedToDeleteCategory'));
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">{t('admin.categories')}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {t('admin.categoriesDescription')}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t('admin.addCategory')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface mb-1">{category.name}</h3>
                <p className="text-sm text-on-surface-variant">{t('admin.slug')}: {category.slug}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
                  title={t('admin.edit')}
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="p-2 text-secondary hover:text-error rounded-lg hover:bg-error-container transition-colors"
                  title={t('admin.delete')}
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="material-symbols-outlined text-[16px]">category</span>
              <span>{category.product_count || 0} {t('admin.productsCount')}</span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">category</span>
          </div>
          <p className="text-on-surface-variant">{t('admin.noCategoriesYet')}</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? t('admin.editCategory') : t('admin.addNewCategory')}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">{t('admin.categoryName')} *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('admin.categoryNamePlaceholder')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">{t('admin.slug')}</label>
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.slugAutoGenerated')}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    setFormData({ name: '', slug: '' });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {submitting ? t('admin.saving') : (editingCategory ? t('admin.saveChanges') : t('admin.createCategory'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}