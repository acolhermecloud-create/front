"use client"

import { useState } from "react"
import crypto from "crypto"

const useFacebookPixelApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const pixelIds = process.env.NEXT_PUBLIC_PIXEL_ID_CODE?.split("|") || []
  const accessTokens = process.env.NEXT_PUBLIC_PIXEL_TOKEN?.split("|") || []

  const hashData = (data) => {
    if (!data) return ""
    return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex")
  }

  // Get browser and context information
  const getBrowserInfo = () => {
    if (typeof window === "undefined") return {}

    return {
      client_ip_address: null, // Will be automatically detected by Facebook
      client_user_agent: navigator.userAgent,
      fbc: getCookie("_fbc"), // Facebook click ID
      fbp: getCookie("_fbp"), // Facebook browser ID
    }
  }

  const getCookie = (name) => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return null
  }

  // Validate if we have minimum required data
  const validateUserData = (eventParams) => {
    const hasEmail = eventParams.email && eventParams.email.includes("@")
    const hasPhone = eventParams.phone && eventParams.phone.length >= 10
    const hasName = eventParams.firstName || eventParams.lastName

    // Facebook requires at least email OR phone for effective matching
    return hasEmail || hasPhone
  }

  const sendEventToFacebook = async (eventName, eventParams, customData = {}) => {
    setIsLoading(true)
    setError(null)

    // Validate minimum required data
    if (!validateUserData(eventParams)) {
      console.warn(`⚠️ Evento ${eventName} não enviado: dados insuficientes de usuário`)
      setIsLoading(false)
      return { success: false, error: "Insufficient user data" }
    }

    if (pixelIds.length !== accessTokens.length) {
      setError("Número de Pixel IDs e Tokens não correspondem.")
      setIsLoading(false)
      return { success: false, error: "Pixel configuration mismatch" }
    }

    const errors = []
    const successes = []
    const browserInfo = getBrowserInfo()

    await Promise.all(
      pixelIds.map(async (pixelId, index) => {
        const token = accessTokens[index]
        const apiUrl = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${token}`

        // Prepare user data with proper hashing and validation
        const userData = {}

        // Email (required if available)
        if (eventParams.email && eventParams.email.includes("@")) {
          userData.em = hashData(eventParams.email)
        }

        // Phone (required if available)
        if (eventParams.phone) {
          const cleanPhone = eventParams.phone.replace(/\D/g, "")
          if (cleanPhone.length >= 10) {
            userData.ph = hashData(cleanPhone)
          }
        }

        // Names
        if (eventParams.firstName) {
          userData.fn = hashData(eventParams.firstName)
        }
        if (eventParams.lastName) {
          userData.ln = hashData(eventParams.lastName)
        }

        // Location data
        if (eventParams.city) {
          userData.ct = hashData(eventParams.city)
        }
        if (eventParams.state) {
          userData.st = hashData(eventParams.state)
        }
        if (eventParams.zipCode) {
          userData.zp = hashData(eventParams.zipCode)
        }
        if (eventParams.country) {
          userData.country = hashData(eventParams.country)
        }

        // Gender and date of birth if available
        if (eventParams.gender) {
          userData.ge = hashData(eventParams.gender)
        }
        if (eventParams.dateOfBirth) {
          userData.db = hashData(eventParams.dateOfBirth)
        }

        // External ID (user ID from your system)
        if (eventParams.externalId) {
          userData.external_id = hashData(eventParams.externalId.toString())
        }

        // Add browser context
        Object.assign(userData, browserInfo)

        // Prepare custom data
        const customEventData = {
          currency: eventParams.currency || "BRL",
        }

        // Add value only for purchase events or when explicitly provided
        if (eventParams.value !== undefined && eventParams.value !== null) {
          customEventData.value = Number.parseFloat(eventParams.value)
        }

        // Add content data
        if (eventParams.contentName) {
          customEventData.content_name = eventParams.contentName
        }
        if (eventParams.contentCategory) {
          customEventData.content_category = eventParams.contentCategory
        }
        if (eventParams.contentIds && eventParams.contentIds.length > 0) {
          customEventData.content_ids = eventParams.contentIds
        }
        if (eventParams.numItems) {
          customEventData.num_items = Number.parseInt(eventParams.numItems)
        }

        // Add any additional custom data
        Object.assign(customEventData, customData)

        // Remove empty values from custom data
        Object.keys(customEventData).forEach((key) => {
          if (customEventData[key] === "" || customEventData[key] === null || customEventData[key] === undefined) {
            delete customEventData[key]
          }
        })

        const eventData = {
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventParams.eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              action_source: "website",
              event_source_url: typeof window !== "undefined" ? window.location.href : "",
              user_data: userData,
              custom_data: customEventData,
            },
          ],
        }

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          })

          const data = await response.json()

          if (data.error) {
            errors.push(`Pixel ${pixelId}: ${data.error.message}`)
            console.error(`❌ Erro no pixel ${pixelId}:`, data.error)
          } else {
            console.log(`✅ Evento ${eventName} enviado com sucesso para pixel ${pixelId}:`, data)
            successes.push(`Pixel ${pixelId}: Success`)
          }
        } catch (err) {
          errors.push(`Pixel ${pixelId}: ${err.message}`)
          console.error(`❌ Erro ao enviar evento para pixel ${pixelId}:`, err)
        }
      }),
    )

    if (errors.length > 0) {
      setError(errors.join("; "))
    }

    setIsLoading(false)

    return {
      success: successes.length > 0,
      errors: errors,
      successes: successes,
    }
  }

  // Specific event methods for better organization
  const trackPageView = (eventParams) => {
    return sendEventToFacebook("PageView", eventParams)
  }

  const trackViewContent = (eventParams) => {
    return sendEventToFacebook("ViewContent", eventParams)
  }

  const trackInitiateCheckout = (eventParams) => {
    return sendEventToFacebook("InitiateCheckout", eventParams)
  }

  const trackAddPaymentInfo = (eventParams) => {
    return sendEventToFacebook("AddPaymentInfo", eventParams)
  }

  const trackPurchase = (eventParams) => {
    return sendEventToFacebook("Purchase", eventParams)
  }

  const trackLead = (eventParams) => {
    return sendEventToFacebook("Lead", eventParams)
  }

  const trackCompleteRegistration = (eventParams) => {
    return sendEventToFacebook("CompleteRegistration", eventParams)
  }

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
    validateUserData,
  }
}

export default useFacebookPixelApi
