export default function useGoogleAnalytics() {
  const sendEvent = (eventName, params = {}) => {
    console.log(`[GA] Tentando enviar evento: ${eventName}`, params)

    if (typeof window === "undefined") {
      console.warn("[GA] window nao disponivel (SSR)")
      return
    }

    if (typeof window.gtag !== "function") {
      console.warn("[GA] window.gtag NAO encontrado. O script do Google Analytics foi carregado?")
      console.log("[GA] window.dataLayer:", window.dataLayer)
      return
    }

    window.gtag("event", eventName, params)
    console.log(`[GA] Evento "${eventName}" enviado com sucesso!`, params)
  }

  const trackPurchase = ({
    transactionId,
    value,
    currency = "BRL",
    items = [],
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    utm_id,
  }) => {
    sendEvent("purchase", {
      transaction_id: transactionId,
      value,
      currency,
      items,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      utm_id,
    })
  }

  const trackBeginCheckout = ({
    value,
    currency = "BRL",
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
  }) => {
    sendEvent("begin_checkout", {
      value,
      currency,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    })
  }

  const trackAddPaymentInfo = ({
    value,
    paymentType = "pix",
    currency = "BRL",
  }) => {
    sendEvent("add_payment_info", {
      value,
      currency,
      payment_type: paymentType,
    })
  }

  const trackGenerateLead = ({
    value,
    currency = "BRL",
  }) => {
    sendEvent("generate_lead", {
      value,
      currency,
    })
  }

  return {
    sendEvent,
    trackPurchase,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackGenerateLead,
  }
}
