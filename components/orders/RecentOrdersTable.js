'use client';

import { ORDER_STATUS_LABELS, formatCurrency, formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';

const MOCK_ORDERS = [
  { _id: '1', orderNumber: 'UC-ABC1-0001', customer: { name: 'فاطمة محمد' }, status: 'completed', total: 350, paymentMethod: 'wallet', scheduledDate: new Date().toISOString(), items: [{ serviceName: 'Home Cleaning' }] },
  { _id: '2', orderNumber: 'UC-ABC2-0002', customer: { name: 'أحمد علي' }, status: 'pending', total: 150, paymentMethod: 'cash', scheduledDate: new Date().toISOString(), items: [{ serviceName: 'Car Cleaning' }] },
  { _id: '3', orderNumber: 'UC-ABC3-0003', customer: { name: 'سارة خالد' }, status: 'on_the_way', total: 520, paymentMethod: 'card', scheduledDate: new Date().toISOString(), items: [{ serviceName: 'Furniture Cleaning' }] },
  { _id: '4', orderNumber: 'UC-ABC4-0004', customer: { name: 'محمد عبدالله' }, status: 'confirmed', total: 200, paymentMethod: 'cash', scheduledDate: new Date().toISOString(), items: [{ serviceName: 'Carpet Cleaning' }] },
  { _id: '5', orderNumber: 'UC-ABC5-0005', customer: { name: 'نورة إبراهيم' }, status: 'cancelled', total: 180, paymentMethod: 'wallet', scheduledDate: new Date().toISOString(), items: [{ serviceName: 'Laundry' }] },
];

export default function RecentOrdersTable() {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>العميل</th>
            <th>الخدمة</th>
            <th>الحالة</th>
            <th>طريقة الدفع</th>
            <th>المبلغ</th>
            <th>التاريخ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ORDERS.map((order) => {
            const statusConfig = ORDER_STATUS_LABELS[order.status];
            return (
              <tr key={order._id}>
                <td className="font-mono text-xs font-medium text-primary-500">{order.orderNumber}</td>
                <td className="font-medium">{order.customer.name}</td>
                <td className="text-gray-500">{order.items[0]?.serviceName}</td>
                <td>
                  <span className={statusConfig?.class}>
                    {statusConfig?.ar}
                  </span>
                </td>
                <td className="text-gray-500 capitalize">{order.paymentMethod}</td>
                <td className="font-semibold">{formatCurrency(order.total)}</td>
                <td className="text-gray-400 text-xs">{formatDate(order.scheduledDate)}</td>
                <td>
                  <button className="btn-ghost p-1.5">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
