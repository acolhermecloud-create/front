import { enviarPedidoPix } from '@/app/service/UtmFy';
import { NextResponse } from 'next/server';

export async function POST(req) {

  const ip = req.headers.get('x-forwarded-for') || req.socket.remoteAddress;

  const {
    orderId,
    status,
    approvedDate,
    customer,
    products,
    utms
  } = req.json();

  const response = await enviarPedidoPix({
    orderId,
    platform: 'Kaixinha',
    paymentMethod: "pix",
    status,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    approvedDate,
    refundedAt: null,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      document: customer.document,
      country: 'BR',
      ip
    },
    products: {
      id: products.id,
      name: products.name,
      planId: products.planId,
      planName: products.planName,
      quantity: 1,
      priceInCents: products.price
    },
    trackingParameters: {
      src: null,
      sck: null,
      utm_source: utms.utm_source,
      utm_campaign: utms.utm_campaign,
      utm_medium: utms.utm_medium,
      utm_content: utms.utm_content,
      utm_term: utms.utm_term,
      utm_id: utms.utm_id,
      fbclid: utms.fbclid,
      sub1: utms.sub1
    },
    commission: {
      totalPriceInCents: products.price,
      gatewayFeeInCents: 0,
      userCommissionInCents: products.price,
    },
    isTest: false,
  })

  return NextResponse.json({ data: response }, { status: 200 });
}