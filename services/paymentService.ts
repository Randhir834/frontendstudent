import api from './api';

export const paymentService = {
  // Get Razorpay Key ID
  getRazorpayKey: async () => {
    const response = await api.get('/payments/razorpay-key');
    return response.data;
  },

  // Create payment order
  createOrder: async (courseId: number, amount: number) => {
    const response = await api.post('/payments/create-order', {
      course_id: courseId,
      amount,
    });
    return response.data;
  },

  // Verify payment after successful transaction
  verifyPayment: async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    paymentMethod?: string
  ) => {
    const response = await api.post('/payments/verify', {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      payment_method: paymentMethod,
    });
    return response.data;
  },

  // Handle payment failure
  handleFailure: async (razorpayOrderId: string, error?: string) => {
    const response = await api.post('/payments/failure', {
      razorpay_order_id: razorpayOrderId,
      error,
    });
    return response.data;
  },

  // Get user's payment history
  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};