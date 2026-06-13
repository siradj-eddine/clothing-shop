'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/types';
import { exportOrderToPDF } from '@/lib/pdfExport';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ordersApi } from '@/lib/api';

interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  size: string;
  color: string;
}

interface OrderWithItems extends Omit<Order, 'items'> {
  items?: OrderItem[];
  subtotal?: string;
  shipping_cost?: string;
}

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<number | null>(null);
  const [exportingOrder, setExportingOrder] = useState<number | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      const ordersArray = Array.isArray(data) ? data : [];
      setOrders(ordersArray);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId: number) => {
    setLoadingDetails(true);
    try {
      const data = await ordersApi.getById(orderId);
      setSelectedOrder(data);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast.error(t('admin.failedToLoadOrderDetails'));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExportPDF = async (order: OrderWithItems) => {
    setExportingOrder(order.id);
    try {
      let orderWithItems = order;
      if (!order.items || order.items.length === 0) {
        orderWithItems = await ordersApi.getById(order.id);
      }
      await exportOrderToPDF(orderWithItems, orderWithItems.items || []);
      toast.success(t('admin.pdfExported'));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('admin.failedToExportPDF'));
    } finally {
      setExportingOrder(null);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-shop-api-7r8z.onrender.com';
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast.success(t('admin.orderStatusUpdated', { id: orderId, status: newStatus }));
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        toast.error(t('admin.failedToUpdateStatus'));
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t('admin.failedToUpdateStatus'));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm(t('admin.confirmDeleteOrder', { id: orderId }))) {
      return;
    }

    setDeletingOrder(orderId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-shop-api-7r8z.onrender.com';
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/orders/${orderId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        toast.success(t('admin.orderDeleted', { id: orderId }));
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        toast.error(t('admin.failedToDeleteOrder'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('admin.failedToDeleteOrder'));
    } finally {
      setDeletingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-500 text-white';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = () => {
    return ['pending', 'paid', 'delivered', 'cancelled'];
  };

  const formatDA = (amount: number): string => {
    return `${Math.round(amount)} DZD`;
  };

  const pendingCount = Array.isArray(orders) ? orders.filter(o => o.status === 'pending').length : 0;
  const paidCount = Array.isArray(orders) ? orders.filter(o => o.status === 'paid').length : 0;
  const deliveredCount = Array.isArray(orders) ? orders.filter(o => o.status === 'delivered').length : 0;
  const cancelledCount = Array.isArray(orders) ? orders.filter(o => o.status === 'cancelled').length : 0;
  
  const filteredOrders = Array.isArray(orders) 
    ? (filterStatus === 'all' ? orders : orders.filter(order => order.status === filterStatus))
    : [];

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
          <h1 className="font-headline-md text-headline-md text-on-surface">{t('admin.orders')}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {t('admin.ordersDescription')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === 'all' ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'}`}
        >
          {t('admin.allOrders')} ({orders.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-surface text-yellow-700 border border-yellow-300 hover:bg-yellow-50'}`}
        >
          {t('admin.pending')} ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('paid')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === 'paid' ? 'bg-blue-500 text-white' : 'bg-surface text-blue-700 border border-blue-300 hover:bg-blue-50'}`}
        >
          {t('admin.paid')} ({paidCount})
        </button>
        <button
          onClick={() => setFilterStatus('delivered')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === 'delivered' ? 'bg-green-500 text-white' : 'bg-surface text-green-700 border border-green-300 hover:bg-green-50'}`}
        >
          {t('admin.delivered')} ({deliveredCount})
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === 'cancelled' ? 'bg-red-500 text-white' : 'bg-surface text-red-700 border border-red-300 hover:bg-red-50'}`}
        >
          {t('admin.cancelled')} ({cancelledCount})
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-bright border-b border-outline-variant/50">
              <tr>
                <th className="p-4 text-left text-secondary text-sm font-medium">{t('admin.orderId')}</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">{t('admin.customer')}</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">{t('admin.date')}</th>
                <th className="p-4 text-right text-secondary text-sm font-medium">{t('admin.amount')}</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">{t('admin.status')}</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">{t('admin.updateStatus')}</th>
                <th className="p-4 text-right text-secondary text-sm font-medium">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-4">
                    <span className="font-medium text-on-surface">#{order.id}</span>
                   </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-on-surface">{order.customer_name}</p>
                      <p className="text-xs text-secondary">{order.customer_email}</p>
                    </div>
                   </td>
                  <td className="p-4 text-secondary">
                    {new Date(order.created_at).toLocaleDateString()}
                   </td>
                  <td className="p-4 text-right font-medium text-on-surface">
                    {formatDA(parseFloat(order.total))}
                   </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(`admin.${order.status}`).toUpperCase()}
                    </span>
                   </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingStatus === order.id}
                      className="px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {getStatusOptions().map((status) => (
                        <option key={status} value={status}>
                          {t(`admin.${status}`).toUpperCase()}
                        </option>
                      ))}
                    </select>
                    {updatingStatus === order.id && (
                      <span className="ml-2 inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    )}
                   </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => fetchOrderDetails(order.id)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {t('admin.view')}
                      </button>
                      <button
                        onClick={() => handleExportPDF(order)}
                        disabled={exportingOrder === order.id}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {exportingOrder === order.id ? '...' : t('admin.pdf')}
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        disabled={deletingOrder === order.id}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingOrder === order.id ? '...' : t('admin.delete')}
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-secondary">
                    {t('admin.noOrdersFound')}
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b bg-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('admin.order')} #{selectedOrder.id}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportPDF(selectedOrder)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {t('admin.exportPDF')}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              {loadingDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">{t('admin.customerInformation')}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><strong>{t('admin.name')}:</strong> {selectedOrder.customer_name}</p>
                      <p><strong>{t('admin.email')}:</strong> {selectedOrder.customer_email}</p>
                      <p><strong>{t('admin.phone')}:</strong> {selectedOrder.customer_phone || 'N/A'}</p>
                      <p><strong>{t('admin.address')}:</strong> {selectedOrder.shipping_address}</p>
                      <p><strong>{t('admin.date')}:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">{t('admin.orderSummary')}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{t('admin.subtotal')}:</span>
                        <span>{formatDA(parseFloat(selectedOrder.subtotal || '0'))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t('admin.shippingCost')}:</span>
                        <span>{formatDA(parseFloat(selectedOrder.shipping_cost || '0'))}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                        <span>{t('admin.total')}:</span>
                        <span>{formatDA(parseFloat(selectedOrder.total))}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">{t('admin.orderItems')}</h3>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="p-3 text-left text-sm font-medium border">{t('admin.product')}</th>
                              <th className="p-3 text-left text-sm font-medium border">{t('admin.size')}</th>
                              <th className="p-3 text-left text-sm font-medium border">{t('admin.color')}</th>
                              <th className="p-3 text-right text-sm font-medium border">{t('admin.quantity')}</th>
                              <th className="p-3 text-right text-sm font-medium border">{t('admin.price')}</th>
                              <th className="p-3 text-right text-sm font-medium border">{t('admin.total')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="p-3 border">{item.product_name}</td>
                                <td className="p-3 border">{item.size || '-'}</td>
                                <td className="p-3 border">{item.color || '-'}</td>
                                <td className="p-3 text-right border">{item.quantity}</td>
                                <td className="p-3 text-right border">{formatDA(parseFloat(item.product_price))}</td>
                                <td className="p-3 text-right border">
                                  {formatDA(parseFloat(item.product_price) * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr className="border-t">
                              <td colSpan={5} className="p-3 text-right font-bold">{t('admin.total')}:</td>
                              <td className="p-3 text-right font-bold">{formatDA(parseFloat(selectedOrder.total))}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {t('admin.noItemsFound')}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}