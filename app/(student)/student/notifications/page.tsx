'use client';

import { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    notificationService.getNotifications().then((d) => setNotifications(d.notifications)).catch(() => setNotifications([]));
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">Stay updated with your latest notifications</p>
        </div>
      </div>
      
      <Card>
        <CardHeader><CardTitle>My Notifications</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {notifications.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-text-muted">No notifications.</p>
              </div>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="border border-border rounded-lg p-3 sm:p-4 hover:border-primary-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-text-primary truncate">{n.title}</p>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">{n.message}</p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
