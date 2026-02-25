// /services/utmify.js

import axios from 'axios';

/**
 * Envia evento Pix para Utmify.
 * @param {Object} data Dados do pedido
 * @param {"waiting_payment"|"paid"} data.status
 */
export async function enviarPedidoPix(data) {
  const {
    orderId,
    platform,
    paymentMethod = 'pix',
    status,
    createdAt,
    approvedDate = null,
    refundedAt = null,
    customer,
    products,
    trackingParameters,
    commission,
    isTest = false,
  } = data;

  const API_TOKEN = process.env.UTMIFY_API_TOKEN;
  const API_URL = 'https://api.utmify.com.br/api-credentials/orders';

  if (!API_TOKEN) throw new Error('API token não definido.');

  const payload = {
    orderId,
    platform,
    paymentMethod,
    status,
    createdAt,
    approvedDate,
    refundedAt,
    customer,
    products,
    trackingParameters,
    commission,
    isTest,
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: { 'x-api-token': API_TOKEN },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error('Erro Utmify:', err.response.data);
      throw new Error(JSON.stringify(err.response.data));
    } else {
      throw err;
    }
  }
}
