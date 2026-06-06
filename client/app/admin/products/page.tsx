'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api';
import { Product } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = () => {
    productsApi.getAll({ page_size: 50 })
      .then((response) => {
        setProducts(response.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setDeletingId(product.id);
    try {
      await productsApi.delete(product.slug);
      toast.success('Product deleted successfully!');
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Products</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage your catalog, inventory, and pricing.
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-bright border-b border-outline-variant/50">
              <tr>
                <th className="p-4 text-left text-secondary text-sm font-medium">Image</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Name</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Category</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Stock</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Price</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Status</th>
                <th className="p-4 text-right text-secondary text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-variant overflow-hidden relative">
                      {product.main_image_url ? (
                        <Image
                          src={product.main_image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-outline">
                          <span className="material-symbols-outlined text-2xl">image_not_supported</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-on-surface">{product.name}</span>
                  </td>
                  <td className="p-4 text-secondary">{product.category_name || '-'}</td>
                  <td className="p-4">
                    <span className={product.stock < 10 ? 'text-error font-medium' : 'text-secondary'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-on-surface">{product.price}DZD</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="p-1.5 text-secondary hover:text-primary rounded-md hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="p-1.5 text-secondary hover:text-error rounded-md hover:bg-error-container transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {deletingId === product.id ? 'hourglass_top' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-secondary">
                    No products found. Click Add Product to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}