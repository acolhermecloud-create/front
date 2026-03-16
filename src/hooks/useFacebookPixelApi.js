"use client"

import { useState } from "react"

const useFacebookPixelApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const pixelIds = process.env.NEXT_PUBLIC_PIXEL_ID_CODE?.split("|") || []
  const accessTokens = process.env.NEXT_PUBLIC_PIXEL_TOKEN?.split("|") || []
  const testEventCode = process.env.NEXT_PUBLIC_FACEBOOK_TEST_EVENT_CODE

  const hashData = async (data) => {
    if (!data) return null

    const normalized = data.toLowerCase().trim()

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(normalized)

    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const getCookie = (name) => {
    if (typeof document === "undefined") return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) return parts.pop()?.split(";").shift()

    return null
  }

  const getBrowserInfo = async () => {
    if (typeof window === "undefined") return {}

    let ip = null

    try {
      const res = await fetch("https://api.ipify.org?format=json")
      const data = await res.json()
      ip = data.ip
    } catch (e) {
      ip = null
    }

    const fbclid = new URLSearchParams(window.location.search).get("fbclid")

    let fbc = getCookie("_fbc")

    if (!fbc && fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`
    }

    return {
      client_user_agent: navigator.userAgent,
      client_ip_address: ip,
      fbc,
      fbp: getCookie("_fbp"),
    }
  }

  const validateUserData = (eventParams) => {
    const hasEmail = eventParams.email && eventParams.email.includes("@")
    const hasPhone =
      eventParams.phone && eventParams.phone.replace(/\D/g, "").length >= 10

    return hasEmail || hasPhone
  }

  const sendEventToFacebook = async (eventName, eventParams = {}, customData = {}) => {
    console.log("🚀 Disparando evento Facebook:", eventName)
    console.log("📦 Params recebidos:", eventParams)

    setIsLoading(true)
    setError(null)

    if (pixelIds.length !== accessTokens.length) {
      const err = "Número de Pixel IDs e Tokens não correspondem"
      console.error("❌ Configuração inválida:", err)
      setError(err)
      setIsLoading(false)
      return
    }

    if (
      eventName !== "PageView" &&
      eventName !== "ViewContent" &&
      !validateUserData(eventParams)
    ) {
      console.warn("⚠️ Evento cancelado por falta de dados de usuário")
      setIsLoading(false)
      return
    }

    const browserInfo = await getBrowserInfo()

    console.log("🌐 Browser info:", browserInfo)

    const errors = []
    const successes = []

    await Promise.all(
      pixelIds.map(async (pixelId, index) => {
        const token = accessTokens[index]

        let apiUrl = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${token}`

        if (testEventCode) {
          apiUrl += `&test_event_code=${testEventCode}`
          console.log("🧪 Modo de teste ativado com código:", testEventCode)
        }

        console.log("🔗 URL da API:", apiUrl)

        const userData = {}

        if (eventParams.email) {
          userData.em = await hashData(eventParams.email)
        }

        if (eventParams.phone) {
          const cleanPhone = eventParams.phone.replace(/\D/g, "")
          if (cleanPhone.length >= 10) {
            userData.ph = await hashData(cleanPhone)
          }
        }

        if (eventParams.firstName) userData.fn = await hashData(eventParams.firstName)
        if (eventParams.lastName) userData.ln = await hashData(eventParams.lastName)
        if (eventParams.city) userData.ct = await hashData(eventParams.city)
        if (eventParams.state) userData.st = await hashData(eventParams.state)
        if (eventParams.zipCode) userData.zp = await hashData(eventParams.zipCode)
        if (eventParams.country) userData.country = await hashData(eventParams.country)

        if (eventParams.externalId) {
          userData.external_id = eventParams.externalId.toString()
        }

        if (browserInfo.client_user_agent)
          userData.client_user_agent = browserInfo.client_user_agent

        if (browserInfo.fbc) userData.fbc = browserInfo.fbc
        if (browserInfo.fbp) userData.fbp = browserInfo.fbp

        const customEventData = {
          currency: eventParams.currency || "BRL",
        }

        if (eventParams.value !== undefined) {
          customEventData.value = parseFloat(eventParams.value)
        }

        Object.assign(customEventData, customData)

        const eventData = {
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id:
                eventParams.eventId ||
                `${eventName}_${Date.now()}_${Math.random()
                  .toString(36)
                  .substring(2, 10)}`,
              action_source: "website",
              event_source_url:
                typeof window !== "undefined" ? window.location.href : "",
              user_data: userData,
              custom_data: customEventData,
            },
          ],
        }

        console.log("📤 Payload enviado ao Facebook:")
        console.log(JSON.stringify(eventData, null, 2))

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          })

          console.log("📡 Status HTTP:", response.status)

          const data = await response.json()

          console.log("📥 Resposta da API:", data)

          if (data.error) {
            console.error(`❌ Erro no pixel ${pixelId}:`, data.error)
            errors.push(data.error.message)
          } else {
            console.log(`✅ Evento ${eventName} enviado com sucesso para pixel ${pixelId}`)
            successes.push(pixelId)
          }
        } catch (err) {
          console.error("🔥 Erro na requisição:", err)
          errors.push(err.message)
        }
      })
    )

    console.log("📊 Resultado final:", {
      sucessos: successes.length,
      erros: errors.length,
    })

    setIsLoading(false)

    if (errors.length) {
      setError(errors.join("; "))
    }

    return {
      success: successes.length > 0,
      errors,
      successes,
    }
  }

  const trackPageView = (params) => sendEventToFacebook("PageView", params)
  const trackViewContent = (params) => sendEventToFacebook("ViewContent", params)
  const trackInitiateCheckout = (params) =>
    sendEventToFacebook("InitiateCheckout", params)
  const trackAddPaymentInfo = (params) =>
    sendEventToFacebook("AddPaymentInfo", params)
  const trackPurchase = (params) => sendEventToFacebook("Purchase", params)
  const trackLead = (params) => sendEventToFacebook("Lead", params)
  const trackCompleteRegistration = (params) =>
    sendEventToFacebook("CompleteRegistration", params)

  return {
    sendEventToFacebook,
    trackPageView,
    trackViewContent,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackLead,
    trackCompleteRegistration,
    isLoading,
    error,
  }
}

export default useFacebookPixelApi