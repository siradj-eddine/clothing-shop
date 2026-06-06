'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import Link from 'next/link';
interface DashboardData {
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    weekly: number;
    monthly: number;
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
    out_of_stock: number;
    categories: number;
  };
  top_products: Array<{ name: string; total_sold: number }>;
  recent_orders: Array<{
    id: number;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  charts: {
    last_7_days: Array<{ date: string; orders: number; revenue: number }>;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load dashboard:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-on-surface-variant">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">Dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Welcome back! Heres whats happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container/20 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
            </div>
            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-secondary text-sm mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-on-surface">{data.revenue.total.toFixed(2)}DZD</h3>
          <p className="text-xs text-secondary mt-2">vs last month: +8.2%</p>
        </div>

        {/* Total Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container rounded-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                shopping_bag
              </span>
            </div>
            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">+8.2%</span>
          </div>
          <p className="text-secondary text-sm mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-on-surface">{data.orders.total}</h3>
          <p className="text-xs text-secondary mt-2">Pending: {data.orders.pending}</p>
        </div>

        {/* Active Products */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-variant rounded-lg">
              <span className="material-symbols-outlined">category</span>
            </div>
          </div>
          <p className="text-secondary text-sm mb-1">Active Products</p>
          <h3 className="text-3xl font-bold text-on-surface">{data.products.active}</h3>
          <p className="text-xs text-secondary mt-2">Total: {data.products.total}</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 relative overflow-hidden hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-error/5 rounded-bl-full"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 bg-error-container rounded-lg">
              <span className="material-symbols-outlined text-error">warning</span>
            </div>
            {data.products.low_stock > 0 && (
              <span className="text-error text-xs bg-error/10 px-2 py-1 rounded-full">Needs Attention</span>
            )}
          </div>
          <p className="text-secondary text-sm mb-1">Low Stock Items</p>
          <h3 className="text-3xl font-bold text-on-surface">{data.products.low_stock}</h3>
          <p className="text-xs text-secondary mt-2">Out of stock: {data.products.out_of_stock}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Chart */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
          <h2 className="font-title-lg text-title-lg text-on-surface mb-4">Orders (Last 7 Days)</h2>
          <div className="h-64 flex items-end justify-between gap-2 pt-4">
            {data.charts.last_7_days.map((day, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div
                  className="bg-primary rounded-t-lg transition-all hover:bg-primary-container"
                  style={{ height: `${(day.orders / Math.max(...data.charts.last_7_days.map(d => d.orders), 1)) * 200}px` }}
                ></div>
                <p className="text-xs text-secondary mt-2">{day.date.slice(5)}</p>
                <p className="text-xs font-medium text-on-surface">{day.orders}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
          <h2 className="font-title-lg text-title-lg text-on-surface mb-4">Revenue (Last 7 Days)</h2>
          <div className="h-64 flex items-end justify-between gap-2 pt-4">
            {data.charts.last_7_days.map((day, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div
                  className="bg-green-500 rounded-t-lg transition-all hover:bg-green-400"
                  style={{ height: `${(day.revenue / Math.max(...data.charts.last_7_days.map(d => d.revenue), 1)) * 200}px` }}
                ></div>
                <p className="text-xs text-secondary mt-2">{day.date.slice(5)}</p>
                <p className="text-xs font-medium text-on-surface">{day.revenue}DZD</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30">
            <h2 className="font-title-lg text-title-lg text-on-surface">Top Selling Products</h2>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {data.top_products.map((product, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                <div>
                  <p className="font-label-md text-label-md text-on-surface">{product.name}</p>
                  <p className="text-xs text-secondary">{product.total_sold} units sold</p>
                </div>
                <span className="text-sm font-medium text-on-surface">Top #{idx + 1}</span>
              </div>
            ))}
            {data.top_products.length === 0 && (
              <div className="p-8 text-center text-secondary">
                No sales yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <h2 className="font-title-lg text-title-lg text-on-surface">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {data.recent_orders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-surface-container-low transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md text-label-md text-on-surface">#{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">{order.customer_name}</span>
                  <span className="font-medium text-on-surface">{order.total.toFixed(2)}DZD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}