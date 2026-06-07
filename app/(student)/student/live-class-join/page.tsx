'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LiveClassJoinPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Join Live Class</h1>
      <Card>
        <CardHeader><CardTitle>Upcoming Session</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted mb-4">Join the Google Meet session for your live class.</p>
          <Button className="w-full sm:w-auto">Join Google Meet</Button>
        </CardContent>
      </Card>
    </div>
  );
}
