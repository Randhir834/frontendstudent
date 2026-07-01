import { useEffect, useState } from 'react';
import { paymentService } from '@/services/paymentService';
import { RazorpayOptions, RazorpayResponse } from '@/types';
import toast from 'react-hot-toast';

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async (
    courseId: number,
    courseTitle: string,
    amount: number,
    userDetails: { name: string; email: string },
    onSuccess: (enrollment: any) => void,
    onFailure?: (error: string) => void
  ) => {
    if (!isLoaded) {
      toast.error('Payment gateway is still loading. Please wait...');
      return;
    }

    if (isProcessing) {
      toast.error('Payment is already in progress');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Get Razorpay Key
      const { key_id } = await paymentService.getRazorpayKey();

      if (!key_id) {
        throw new Error('Payment gateway not configured');
      }

      // Step 2: Create Order
      const { order, payment_id } = await paymentService.createOrder(courseId, amount);

      // Step 3: Configure Razorpay Options
      const options: RazorpayOptions = {
        key: key_id,
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: 'PlayFit LMS',
        description: courseTitle,
        order_id: order.id,
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using Net Banking',
                instruments: [
                  {
                    method: 'netbanking',
                  },
                ],
              },
              card: {
                name: 'Pay using Cards',
                instruments: [
                  {
                    method: 'card',
                  },
                ],
              },
              upi: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                  },
                ],
              },
            },
            sequence: ['block.upi', 'block.card', 'block.banks'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Step 4: Verify Payment
            const result = await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            toast.success('Payment successful! You are now enrolled in the course.');
            onSuccess(result.enrollment);
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error(error.response?.data?.error || 'Payment verification failed');
            
            // Record failure
            await paymentService.handleFailure(
              response.razorpay_order_id,
              'Verification failed'
            );
            
            if (onFailure) {
              onFailure('Payment verification failed');
            }
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
        },
        theme: {
          color: '#4F46E5', // Indigo color
        },
        modal: {
          ondismiss: async () => {
            setIsProcessing(false);
            
            // Record dismissal as failure
            await paymentService.handleFailure(
              order.id,
              'Payment cancelled by user'
            );
            
            toast.error('Payment cancelled');
            
            if (onFailure) {
              onFailure('Payment cancelled by user');
            }
          },
        },
      };

      // Step 5: Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setIsProcessing(false);
      
      const errorMessage = error.response?.data?.error || 'Failed to initiate payment';
      toast.error(errorMessage);
      
      if (onFailure) {
        onFailure(errorMessage);
      }
    }
  };

  return {
    isLoaded,
    isProcessing,
    initiatePayment,
  };
};
