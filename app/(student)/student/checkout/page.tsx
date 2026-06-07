'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CheckoutPage() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Checkout</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">Complete your course purchase</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input label="Card Number" id="card" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Input label="Expiry" id="expiry" placeholder="MM/YY" />
                <Input label="CVC" id="cvc" placeholder="123" />
              </div>
              <Button type="submit" className="w-full">Pay Now</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-text-muted">Course pricing and summary will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
