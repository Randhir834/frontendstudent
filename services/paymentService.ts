import api from './api';

export const paymentService = {
  completePayment: async (paymentId: number, transactionId: string) => {
    const response = await api.post('/payments/complete', {
      payment_id: paymentId,
      transaction_id: transactionId
    });
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  getPaymentById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};