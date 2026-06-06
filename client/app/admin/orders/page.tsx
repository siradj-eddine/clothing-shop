'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/types';
import { exportOrderToPDF } from '@/lib/pdfExport';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  size: string;
  color: string;
}

interface OrderWithItems extends Order {
  items?: OrderItem[];
  subtotal?: string;
  shipping_cost?: string;
}

export default function AdminOrdersPage() {
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
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/orders/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
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
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExportPDF = async (order: OrderWithItems) => {
    setExportingOrder(order.id);
    try {
      let orderWithItems = order;
      if (!order.items || order.items.length === 0) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/orders/${order.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        orderWithItems = await response.json();
      }
      await exportOrderToPDF(orderWithItems, orderWithItems.items || []);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExportingOrder(null);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast.success(`Order #${orderId} status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm(`Are you sure you want to delete Order #${orderId}? This action cannot be undone.`)) {
      return;
    }

    setDeletingOrder(orderId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        toast.success(`Order #${orderId} deleted successfully`);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete order');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Orders</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and track customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterStatus === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterStatus === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-surface text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('paid')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterStatus === 'paid'
              ? 'bg-blue-500 text-white'
              : 'bg-surface text-blue-700 border border-blue-300 hover:bg-blue-50'
          }`}
        >
          Paid ({paidCount})
        </button>
        <button
          onClick={() => setFilterStatus('delivered')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterStatus === 'delivered'
              ? 'bg-green-500 text-white'
              : 'bg-surface text-green-700 border border-green-300 hover:bg-green-50'
          }`}
        >
          Delivered ({deliveredCount})
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterStatus === 'cancelled'
              ? 'bg-red-500 text-white'
              : 'bg-surface text-red-700 border border-red-300 hover:bg-red-50'
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-bright border-b border-outline-variant/50">
              <tr>
                <th className="p-4 text-left text-secondary text-sm font-medium">Order ID</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Date</th>
                <th className="p-4 text-right text-secondary text-sm font-medium">Amount</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Status</th>
                <th className="p-4 text-left text-secondary text-sm font-medium">Update Status</th>
                <th className="p-4 text-right text-secondary text-sm font-medium">Actions</th>
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
                      {order.status.toUpperCase()}
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
                          {status.toUpperCase()}
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
                        View
                      </button>
                      <button
                        onClick={() => handleExportPDF(order)}
                        disabled={exportingOrder === order.id}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {exportingOrder === order.id ? '...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        disabled={deletingOrder === order.id}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingOrder === order.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-secondary">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Order #{selectedOrder.id}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportPDF(selectedOrder)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            
            {loadingDetails ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customer_phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {selectedOrder.shipping_address}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Order Summary with Subtotal, Shipping, Total */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal:</span>
                      <span>{formatDA(parseFloat(selectedOrder.subtotal || '0'))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Shipping Cost:</span>
                      <span>{formatDA(parseFloat(selectedOrder.shipping_cost || '0'))}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatDA(parseFloat(selectedOrder.total))}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left text-sm font-medium border">Product</th>
                            <th className="p-3 text-left text-sm font-medium border">Size</th>
                            <th className="p-3 text-left text-sm font-medium border">Color</th>
                            <th className="p-3 text-right text-sm font-medium border">Qty</th>
                            <th className="p-3 text-right text-sm font-medium border">Price</th>
                            <th className="p-3 text-right text-sm font-medium border">Total</th>
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
                            <td colSpan={5} className="p-3 text-right font-bold">Total:</td>
                            <td className="p-3 text-right font-bold">{formatDA(parseFloat(selectedOrder.total))}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No items found for this order.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}