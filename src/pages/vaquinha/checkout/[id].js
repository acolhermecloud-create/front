"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Breadcrumbs,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Modal,
  InputAdornment,
  FormHelperText,
  useMediaQuery,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material"
import { ExpandMore, CheckCircle, Pix, QrCode, ContentCopy, Receipt, PhoneAndroid, WarningAmber } from "@mui/icons-material"
import { formatCurrency, generateValidCPF, truncateText, validateCNPJ, validateCPF, validateEmail } from "@/utils/functions"
import { useCampaign } from "@/context/CampaignContext"
import { useLoading } from "@/context/LoadingContext"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"

import { useTheme } from "@mui/material/styles"
import { useAuth } from "@/context/AuthContext"
import usePixelEvent from "@/hooks/usePixelEvent"
import useFacebookPixelApi from "@/hooks/useFacebookPixelApi"
import useGoogleAnalytics from "@/hooks/useGoogleAnalytics"
import { useUtm } from "@/hooks/useUtm"

export default function CheckoutDonate() {
  const router = useRouter()
  const { id, image } = router.query

  const utm = useUtm()

  const isMounted = useRef(true)
  const { handleGetCampaignBySlug, handleGeneratePaymentViaPIX, checkPaymentDonation, handleRecordUtm } = useCampaign()
  const { handleLoading, handleCloseLoading, loading } = useLoading()

  const firePixelEvent = usePixelEvent()
  const {
    sendEventToFacebook,
    trackPageView,
    trackViewContent,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackLead,
  } = useFacebookPixelApi()

  const ga = useGoogleAnalytics()

  const [expanded, setExpanded] = useState("panel1")

  // Estados para os campos do formulário
  const value = "3000"
  const [campaign, setCampaign] = useState(null)
  const [valueOfDonation, setValueOfDonation] = useState("3000")
  const [newValue, setNewValue] = useState("3000")
  const [openModal, setOpenModal] = useState(false)
  const [fillContact, setFillContact] = useState(false)
  const [fillPayment, setFillPayment] = useState(false)
  const [fillPaymentMethod, setFillPaymentMethod] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("Pix")
  const [donateAsCompany, setDonateAsCompany] = useState(false)
  const [anonymousDonation, setAnonymousDonation] = useState(false)

  const [securityModalOpen, setSecurityModalOpen] = useState(false)

  // Estados para os campos de contato
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [document, setDocument] = useState("")
  const [phone, setPhone] = useState("")

  const [paymentConfirmed, setPaymentConfirmed] = useState()
  const [qrCodeImage, setQrCodeImage] = useState()
  const [qrCode, setQrCode] = useState()
  const [transactionId, setTransactionId] = useState()

  const [loggedUser, setLoggedUser] = useState()
  const { getToken, validateTokenWithOutRedirect } = useAuth()

  // Validação básica
  const [errors, setErrors] = useState({})
  const [leadSent, setLeadSent] = useState(false)

  const [pixGenerated, setPixGenerated] = useState(false)

  const paymentMethods = [
    { icon: <Pix />, label: "Pix" },
    /*{ icon: <QrCode />, label: 'Boleto' },
    { icon: <CreditCard />, label: 'Cartão' },*/
  ]

  // Helper function to get tracking data
  const getTrackingData = () => {
    const [firstName, ...lastNameParts] = name.split(" ")
    const lastName = lastNameParts.join(" ")

    const valueNumber = Number.parseFloat(
      (Number.parseInt(valueOfDonation || "0") / 100).toFixed(2),
    )

    return {
      email: email || "",
      phone: phone || "",
      firstName: firstName || "",
      lastName: lastName || "",
      value: valueNumber,
      currency: "BRL",

      contentName: campaign?.title || "",
      contentCategory: "donation",
      contentIds: [campaign?.id?.toString() || id?.toString() || ""],

      eventId: `${campaign?.slug || id}_${Date.now()}`,
      externalId: loggedUser?.id || null,
      country: "br",

      // 🔥 UTMs (Google, Meta, orgânico, afiliado)
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      utm_term: utm.utm_term || "",
      utm_content: utm.utm_content || "",
      utm_id: utm.utm_id || "",

      // 🔥 Click IDs separados
      fbclid: utm.fbclid || "",
      gclid: utm.gclid || "",

      // 🔥 Identificador de afiliado / fallback
      sub1: utm.sub1 || utm.fbclid || utm.gclid || "",

      // 🔥 Fonte de tráfego detectada (útil pra backend / BI)
      traffic_source: utm.fbclid
        ? "meta_ads"
        : utm.gclid
          ? "google_ads"
          : utm.utm_source || "direct",
    }
  }

  const handleChangePanel = (panel) => async (event, isExpanded) => {
    if (panel === "panel2") {
      if (email && validateEmail(email)) {
        // Track InitiateCheckout when user moves to payment step
        const trackingData = getTrackingData()

        // Only send if we have minimum required data
        if (trackingData.email || trackingData.phone) {
          await trackInitiateCheckout(trackingData)

          // Also send lead event for contact completion
          await trackLead({
            ...trackingData,
            eventId: `lead_${campaign?.slug || id}_${Date.now()}`,
          })

          ga.trackBeginCheckout({
            value: trackingData.value,
            currency: "BRL",

            utm_source: trackingData.utm_source,
            utm_medium: trackingData.utm_medium,
            utm_campaign: trackingData.utm_campaign,
            utm_term: trackingData.utm_term,
            utm_content: trackingData.utm_content,

            gclid: trackingData.gclid,
          })
          ga.trackGenerateLead({
            value: trackingData.value,
            currency: "BRL",

            utm_source: trackingData.utm_source,
            utm_medium: trackingData.utm_medium,
            utm_campaign: trackingData.utm_campaign,
            utm_term: trackingData.utm_term,
            utm_content: trackingData.utm_content,

            gclid: trackingData.gclid,
          })
        }
      }
    }

    if (panel !== "panel3") {
      setExpanded(panel)
    } else {
      if (selectedMethod !== "Pix") {
        toast.warning("Método de pagamento não disponível no momento")
        return
      }
      handleGeneratePix()
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true)

    // Track value change intent
    if (email && validateEmail(email)) {
      const trackingData = getTrackingData()
      sendEventToFacebook("CustomizeProduct", {
        ...trackingData,
        eventId: `customize_${campaign?.slug || id}_${Date.now()}`,
      })
    }
  }

  const handleCloseModal = () => {
    setNewValue(newValue.replace(/\D/g, ""))
    setOpenModal(false)
  }

  const handleChangeValue = () => {
    const sanitizedValue = newValue ? Number.parseInt(newValue.replace(/\D/g, ""), 10) : 0
    const minValue = Number.parseInt(process.env.NEXT_PUBLIC_MIN_VALUE_OF_DONATION_IN_CENTS, 10)

    if (isNaN(sanitizedValue) || isNaN(minValue)) {
      toast.error("Erro ao validar os valores. Por favor, tente novamente.")
      return
    }

    if (sanitizedValue < minValue) {
      toast.error(`Defina um valor acima de R$ ${formatCurrency(`${minValue}`)}`)
      return
    }

    setValueOfDonation(sanitizedValue.toString())
    setNewValue(sanitizedValue.toString())
    handleCloseModal()

    // Track value change
    if (email && validateEmail(email)) {
      const trackingData = {
        ...getTrackingData(),
        value: Number.parseFloat((sanitizedValue / 100).toFixed(2)),
        eventId: `value_change_${campaign?.slug || id}_${Date.now()}`,
      }

      sendEventToFacebook("AddToCart", trackingData)
    }

    if (expanded === "panel3") {
      setExpanded("panel2")
    }
  }

  const getCampaignDetails = async (slug) => {
    handleLoading()
    const response = await handleGetCampaignBySlug(slug)
    if (response.status) {
      setCampaign(response.data.campaign)

      // Track ViewContent when campaign loads
      const trackingData = {
        value: Number.parseFloat((Number.parseInt(value) / 100).toFixed(2)),
        currency: "BRL",
        contentName: response.data.campaign.title,
        contentCategory: "donation",
        contentIds: [response.data.campaign.id?.toString() || slug],
        eventId: `view_${slug}_${Date.now()}`,
      }

      trackViewContent(trackingData)
    }
    handleCloseLoading()
  }

  const handleGeneratePix = async () => {
    handleLoading()

    const valueInCents = Number.parseInt(valueOfDonation)
    const trackingData = getTrackingData()

    // Track AddPaymentInfo when PIX is generated
    await trackAddPaymentInfo({
      ...trackingData,
      eventId: `payment_info_${campaign?.slug || id}_${Date.now()}`,
    })

    ga.trackBeginCheckout({
      value: trackingData.value,
      currency: "BRL",

      utm_source: trackingData.utm_source,
      utm_medium: trackingData.utm_medium,
      utm_campaign: trackingData.utm_campaign,
      utm_term: trackingData.utm_term,
      utm_content: trackingData.utm_content,

      gclid: trackingData.gclid,
    })

    const response = await handleGeneratePaymentViaPIX(
      campaign.id,
      valueInCents,
      name,
      email,
      document.replace(/\D/g, ""),
      phone,
    )

    if (response.status) {
      setQrCodeImage(response.data.qRCode)
      setQrCode(response.data.code)
      setTransactionId(response.data.id)
      setPixGenerated(true)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      setSecurityModalOpen(true)

      await sendUtmfyData(
        response.data.id,
        "waiting_payment",
        trackingData,
        name,
        email,
        phone,
        document.replace(/\D/g, ""),
        campaign.slug,
        campaign.title,
        campaign.slug,
        campaign.title,
        valueInCents,
      )

      // Track payment generation
      await sendEventToFacebook("GenerateLead", {
        ...trackingData,
        eventId: `pix_generated_${campaign?.slug || id}_${Date.now()}`,
      })

      // Google Analytics - add_payment_info
      ga.trackAddPaymentInfo({
        value: trackingData.value,
        paymentType: "pix",
      })
    } else {
      toast.warning(response?.data?.message ?? "Verifique o valor digitado!")
    }

    handleCloseLoading()
  }

  const handleCheckPayment = async () => {
    if (!transactionId) return

    const response = await checkPaymentDonation(transactionId)

    if (response.status) {
      if (response.data.payed) {
        setPaymentConfirmed(true)

        const trackingData = getTrackingData()

        sendLead(trackingData)

        // Track Purchase with comprehensive data
        const purchaseData = {
          ...trackingData,
          eventId: `purchase_${transactionId}_${Date.now()}`,
          transactionId: transactionId,
          orderId: transactionId,
        }

        // Send to multiple pixels as before
        firePixelEvent(
          "Purchase",
          {
            email,
            value: (Number.parseInt(valueOfDonation) / 100).toFixed(2),
          },
          { eventID: "start-campaign-1554207512648166" },
        )

        firePixelEvent(
          "Purchase",
          {
            email,
            value: (Number.parseInt(valueOfDonation) / 100).toFixed(2),
          },
          { eventID: "start-campaign-988398956462728" },
        )

        // Enhanced purchase tracking
        await trackPurchase(purchaseData)

        // Track successful conversion
        await sendEventToFacebook("CompleteRegistration", {
          ...trackingData,
          eventId: `conversion_${transactionId}_${Date.now()}`,
        })

        // Google Analytics - purchase com UTMs
        ga.trackPurchase({
          transactionId: transactionId,
          value: trackingData.value,
          currency: "BRL",
          items: [
            {
              item_id: trackingData.contentIds[0],
              item_name: trackingData.contentName,
              price: trackingData.value,
              quantity: 1,
            },
          ],

          utm_source: trackingData.utm_source,
          utm_medium: trackingData.utm_medium,
          utm_campaign: trackingData.utm_campaign,
          utm_term: trackingData.utm_term,
          utm_content: trackingData.utm_content,

          gclid: trackingData.gclid,
        })
      }
    }
  }

  const sendUtmfyData = async (
    orderId,
    status,
    trackingData,
    customerName,
    customerEmail,
    customerPhone,
    customerDocument,
    productId,
    productName,
    productPlanId,
    productPlanName,
    productPrice,
  ) => {
    const payload = {
      orderId,
      status,
      approvedDat:
        status === "paid"
          ? new Date().toISOString().slice(0, 19).replace("T", " ")
          : null,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        document: customerDocument,
      },
      products: [
        {
          id: productId,
          name: productName,
          planId: productPlanId,
          planName: productPlanName,
          quantity: 1,
          priceInCents: productPrice,
        },
      ],
      trackingParameters: {
        utmSource: trackingData.utm_source,
        utmMedium: trackingData.utm_medium,
        utmCampaign: trackingData.utm_campaign,
        utmContent: trackingData.utm_content,
        utmTerm: trackingData.utm_term,
        utmId: trackingData.utm_id,
        fbclid: trackingData.fbclid,
        gclid: trackingData.gclid,
        sub1: trackingData.sub1,
      },
      commission: {
        totalPriceInCents: productPrice,
        gatewayFeeInCents: 0,
        userCommissionInCents: productPrice,
      },
    }

    try {
      console.group("📡 UTMFY SEND")
      console.log("🧾 orderId:", orderId)
      console.log("🏷️ UTMs:", payload.trackingParameters)
      console.log("📤 payload:", payload)

      const response = await handleRecordUtm(payload)

      console.log("✅ RESPONSE:", response)
      console.groupEnd()
    } catch (error) {
      console.group("❌ UTMFY ERROR")
      console.error("orderId:", orderId)
      console.error("erro:", error)
      console.groupEnd()
    }
  }

  const generateRandomDigits = (length) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join("")

  const generateFakeEmail = () =>
    `doacao${Date.now()}@gmail.com`

  const generateFakeCPF = () => generateValidCPF(11)

  const generateFakePhone = () => `55${generateRandomDigits(11)}`

  useEffect(() => {
    validateTokenWithOutRedirect().then(() => {
      const loggedData = getToken()
      setLoggedUser(loggedData)
      if (loggedData) {
        setName(loggedData.name)
        setDocument(loggedData.documentId)
        setEmail(loggedData.email)
        setPhone(`+55${loggedData.phone}`)
      }
    })
  }, [getToken])

  useEffect(() => {
    if (isMounted.current && id) {
      isMounted.current = false

      setEmail(generateFakeEmail())
      setDocument(generateFakeCPF())
      setPhone(generateFakePhone())

      getCampaignDetails(id)
      setValueOfDonation(value.toString())

      // Track page view on initial load
      const trackingData = getTrackingData()

      trackPageView({
        value: Number.parseInt(value) / 100,
        currency: "BRL",
        contentName: trackingData.contentName,
        contentCategory: "donation",
        eventId: `pageview_${trackingData.contentIds[0]}_${Date.now()}`,

        utm_source: trackingData.utm_source,
        utm_medium: trackingData.utm_medium,
        utm_campaign: trackingData.utm_campaign,
        utm_term: trackingData.utm_term,
        utm_content: trackingData.utm_content,

        gclid: trackingData.gclid,
      })
    }
  }, [id, value])

  useEffect(() => {
    // Só executa o intervalo se transactionId estiver definido
    if (transactionId) {
      const interval = setInterval(async () => {
        if (!paymentConfirmed) {
          try {
            await handleCheckPayment() // Aguarda a execução da função
          } catch (error) {
            console.error("Erro ao verificar o pagamento:", error)
          }
        }
      }, 2000)

      // Limpa o intervalo ao desmontar ou quando o pagamento for confirmado
      return () => clearInterval(interval)
    }
  }, [transactionId, paymentConfirmed]) // Dependências importantes

  const sendLead = async (trackingData) => {

    const baseEventId = `${campaign?.slug || id}_${Date.now()}`

    await sendEventToFacebook("CompleteRegistration", {
      ...trackingData,
      eventId: `contact_complete_${baseEventId}`,
    })

    await sendEventToFacebook("Lead", {
      ...trackingData,
      eventId: `lead_${baseEventId}`,
    })

    ga.trackGenerateLead({
      value: trackingData.value,
      currency: "BRL",
      utm_source: trackingData.utm_source,
      utm_medium: trackingData.utm_medium,
      utm_campaign: trackingData.utm_campaign,
      utm_term: trackingData.utm_term,
      utm_content: trackingData.utm_content,
      gclid: trackingData.gclid
    })

    setLeadSent(true)
  }

  if (loading || !campaign) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <Box
        sx={{
          py: 3,
          px: 1.5,
          maxWidth: 1200,
          overflowY: "auto",
          mx: "auto",
        }}
      >
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href={`/vaquinha/${campaign?.slug}`}>
            Vaquinha
          </Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>

        {!pixGenerated && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
                Checkout da Doação
              </Typography>

              <Paper sx={{
                py: 3,
                px: 1,
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                backgroundColor: "#fff",
              }}>
                <Typography variant="h6" sx={{ mb: 2 }} fontWeight={600}>
                  Escolha um valor
                </Typography>

                {/* Botões pré-selecionados */}
                <Stack
                  direction="row"
                  spacing={0.1}
                  sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
                >
                  {[1000, 3000, 5000, 10000, 20000].map((v) => {
                    const isActive = valueOfDonation === String(v)

                    return (
                      <Button
                        key={v}
                        onClick={() => setValueOfDonation(String(v))}
                        sx={{
                          borderRadius: 999,
                          px: 2.5,
                          py: 1,
                          fontWeight: 600,
                          fontSize: 14,
                          textTransform: "none",
                          minWidth: 0,

                          backgroundColor: isActive ? "#F43F5E" : "#F9FAFB",
                          color: isActive ? "#fff" : "#374151",
                          border: "1px solid",
                          borderColor: isActive ? "#F43F5E" : "#E5E7EB",
                          boxShadow: isActive
                            ? "0 4px 12px rgba(244,63,94,0.35)"
                            : "none",

                          "&:hover": {
                            backgroundColor: isActive ? "#E11D48" : "#F3F4F6",
                            borderColor: isActive ? "#E11D48" : "#D1D5DB",
                          },
                        }}
                      >
                        {formatCurrency(String(v))}
                      </Button>
                    )
                  })}
                </Stack>

                {/* Input valor */}
                <TextField
                  fullWidth
                  label="Outro valor"
                  value={formatCurrency(valueOfDonation)}
                  onChange={(e) =>
                    setValueOfDonation(e.target.value.replace(/\D/g, ""))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#F43F5E",
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Paper>

              {/* Form de contato */}
              <Paper sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                backgroundColor: "#fff",
              }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Contato
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "#F9FAFB",
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#D1D5DB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#F43F5E",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/*<Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CPF/CNPJ"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      error={!!errors.document}
                      helperText={errors.document}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <PhoneInput
                      defaultCountry="BR"
                      value={phone}
                      onChange={setPhone}
                      style={{ width: "100%" }}
                    />
                    {!!errors.phone && (
                      <FormHelperText>{errors.phone}</FormHelperText>
                    )}
                  </Grid>
                  */}
                </Grid>
              </Paper>

              {/* Botão gerar PIX */}
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={async () => {
                  await handleGeneratePix()
                }}
                sx={{
                  py: 1.8,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 16,
                  background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                  boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
                  transition: "all .2s ease",

                  "&:hover": {
                    background: "linear-gradient(135deg, #F43F5E, #BE123C)",
                    boxShadow: "0 6px 20px rgba(244,63,94,0.45)",
                    transform: "translateY(-1px)",
                  },

                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 3px 10px rgba(244,63,94,0.35)",
                  },

                  "&.Mui-disabled": {
                    background: "#E5E7EB",
                    color: "#9CA3AF",
                    boxShadow: "none",
                  },
                }}
              >
                Gerar Pix
              </Button>
            </Grid>

            {/* Resumo lateral permanece */}
            <Grid item xs={12} md={4}>
              <SummarySection
                campaign={campaign}
                image={image}
                valueOfDonation={valueOfDonation}
                handleOpenModal={() => { }}
              />
            </Grid>
          </Grid>
        )}

        {!paymentConfirmed && pixGenerated && qrCodeImage && (
          <Stack spacing={3} sx={{ mt: 3 }}>
            {/* CARD AVISO */}
            <Dialog
              open={securityModalOpen}
              maxWidth="xs"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  p: 1,
                  textAlign: "center",
                },
              }}
            >
              <DialogContent sx={{ pt: 3 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    backgroundColor: "#FEF2F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <WarningAmber sx={{ color: "#F43F5E", fontSize: 40 }} />
                </Box>

                <Typography variant="h6" fontWeight={800} mb={1}>
                  ÚLTIMO AVISO
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                  }}
                >
                  É seguro continuar com o pagamento.
                </Typography>

                <Box
                  sx={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 3,
                    p: 2,
                    textAlign: "justify",
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    Se aparecer alerta de "golpe" no aplicativo do banco, pode ignorar e
                    prosseguir. Isso ocorre porque a conta da Todos Por África é nova e
                    está recebendo grande volume de doações.
                  </Typography>
                </Box>
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setSecurityModalOpen(false)}
                  sx={{
                    py: 1.6,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                    boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #F43F5E, #BE123C)",
                    },
                  }}
                >
                  Entendi, continuar
                </Button>
              </DialogActions>
            </Dialog>

            {/* CARD COPIA E COLA */}
            <Card elevation={6} sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              backgroundColor: "#fff",
            }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Copie o código Pix
              </Typography>

              <TextField
                fullWidth
                value={qrCode}
                InputProps={{
                  readOnly: true,
                  disabled: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={() => {
                          navigator.clipboard.writeText(qrCode)
                          toast.success("Copiado")
                        }}
                        sx={{
                          py: 0.8,
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: 16,
                          background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                          boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
                          transition: "all .2s ease",

                          "&:hover": {
                            background: "linear-gradient(135deg, #F43F5E, #BE123C)",
                            boxShadow: "0 6px 20px rgba(244,63,94,0.45)",
                            transform: "translateY(-1px)",
                          },

                          "&:active": {
                            transform: "translateY(0)",
                            boxShadow: "0 3px 10px rgba(244,63,94,0.35)",
                          },

                          "&.Mui-disabled": {
                            background: "#E5E7EB",
                            color: "#9CA3AF",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Copiar
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Card>

            {/* CARD QR CODE */}
            <Card elevation={6} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                ou escaneie o QR Code
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Escaneie o QR Code no app do seu banco
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={`data:image/png;base64,${qrCodeImage}`}
                  style={{ maxWidth: 220 }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                Após o pagamento, a confirmação é automática
              </Typography>
            </Card>
          </Stack>
        )}

        {paymentConfirmed && (
          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckCircle sx={{ color: "#10B981", fontSize: 40 }} />
            </Box>

            <Typography variant="h5" fontWeight={700} mb={1}>
              Pagamento confirmado!
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={3}>
              Sua doação foi recebida com sucesso. Muito obrigado pelo seu apoio 💚
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.6,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(135deg, #10B981, #059669)",
                boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #10B981, #047857)",
                },
              }}
              onClick={() => window.location.reload()}
            >
              Fazer nova doação
            </Button>
          </Card>
        )}
      </Box>

      <ValueChangeModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        newValue={newValue}
        setNewValue={setNewValue}
        handleChangeValue={handleChangeValue}
      />
    </>
  )
}

// Componentes auxiliares permanecem os mesmos...

function LoadingSkeleton() {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Breadcrumbs Skeleton */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Skeleton width={80} />
        <Skeleton width={100} />
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Main Content Skeleton */}
          <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
            <Skeleton width="50%" />
          </Typography>

          <Box component={Paper} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Skeleton width="30%" height={32} />
              <Skeleton width={32} height={32} />
            </Box>

            <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />

            <Skeleton variant="rectangular" height={32} width="50%" sx={{ mt: 3, mb: 2 }} />
            <Skeleton variant="rectangular" height={48} width="100%" />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Summary Section Skeleton */}
          <Box component={Paper} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Skeleton width="30%" height={32} />
              <Skeleton width={32} height={32} />
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardMedia>
                <Skeleton variant="rectangular" height={140} />
              </CardMedia>
              <CardContent>
                <Skeleton width="80%" />
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Skeleton width="30%" height={32} />
              <Skeleton width="20%" height={32} />
            </Box>

            <Skeleton variant="rectangular" height={48} width="100%" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

function ContactForm({
  expanded,
  handleChange,
  name,
  setName,
  email,
  setEmail,
  document,
  setDocument,
  phone,
  setPhone,
  donateAsCompany,
  setDonateAsCompany,
  anonymousDonation,
  setAnonymousDonation,
  errors,
  fillContact,
  handleSaveContact,
}) {
  return (
    <Box sx={{ px: 3, mb: 2 }}>
      <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
          <Stack
            style={{ width: "100%" }}
            alignItems={"center"}
            display={"flex"}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6">Contato</Typography>
            <CheckCircle color="success" style={{ visibility: fillContact ? "visible" : "hidden" }} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Nome"
                placeholder="Jhon Doe"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="E-mail"
                placeholder="jhon@mail.com"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="CPF/CNPJ"
                placeholder="000.000.000-00"
                variant="outlined"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                error={!!errors.document}
                helperText={errors.document}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PhoneInput
                defaultCountry="BR"
                className="form-control"
                value={phone}
                onChange={setPhone}
                style={{
                  width: "100%",
                  maxWidth: "30ch",
                  padding: "4px 8px",
                  fontSize: "1rem",
                  border: "1px solid #0d0d0d",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
              {!!errors.phone && <FormHelperText>{errors.phone}</FormHelperText>}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "end", flexDirection: "row" }}>
            <Button
              variant="contained"
              onClick={handleSaveContact}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                py: 1,
                textTransform: "none",
              }}
            >
              Salvar
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

function PaymentForm({ expanded, handleChange, fillPayment, selectedMethod, setSelectedMethod, paymentMethods }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box sx={{ px: 3, mb: 3 }}>
      <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel2-content" id="panel2-header">
          <Stack
            style={{ width: "100%" }}
            alignItems={"center"}
            display={"flex"}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6">Forma de Pagamento</Typography>
            <CheckCircle color="success" style={{ visibility: fillPayment ? "visible" : "hidden" }} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Formas de pagamento
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {paymentMethods.map((method, index) => (
              <Grid item xs={2} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => setSelectedMethod(method.label)}
                >
                  <Box
                    sx={{
                      bgcolor: "#f8e5ea",
                      p: 1,
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    {React.cloneElement(method.icon, {
                      style: {
                        width: 24,
                        height: 24,
                        color: selectedMethod === method.label ? theme.palette.primary.main : "gray",
                      },
                    })}
                  </Box>
                  <Typography variant="body2">{method.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ px: 2, bgcolor: "grey.50", borderRadius: 1, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {selectedMethod === "Pix" && (
                <>
                  Ao doar por Pix, aparecerá na tela da transação o nome Pagamentos Seguros Brasil e, em alguns casos, a
                  Pagamentos Seguros Brasil como banco destinatário. Já, no seu comprovante, aparecerá Kaixinha
                  Intermiadções.
                </>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                py: 1,
                textTransform: "none",
              }}
              onClick={handleChange("panel3")}
            >
              Continuar
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

function PaymentPixData({ expanded, handleChange, fillPaymentMethod, paymentConfirmed, qrCodeImage, qrCode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("QR Code copiado com sucesso!")
      })
      .catch((error) => {
        toast.error("Erro ao copiar o texto:", error)
      })
  }

  return (
    <Box sx={{ px: 3, mb: 3 }}>
      <Accordion expanded={expanded === "panel3"}>
        <AccordionSummary aria-controls="panel3-content" id="panel3-header">
          <Stack
            style={{ width: "100%" }}
            alignItems={"center"}
            display={"flex"}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6">Pagamento</Typography>
            <CheckCircle color="success" style={{ visibility: fillPaymentMethod ? "visible" : "hidden" }} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12}>
              <Box>
                {!paymentConfirmed && (
                  <>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography
                        id="modal-modal-title"
                        variant="subtitle1"
                        component="h2"
                        fontSize={{ xs: "0.875rem", sm: "1rem" }}
                      >
                        Quase lá! Você está perto de fazer uma boa ação
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 2 }} fontSize={{ xs: "0.675rem", sm: "1rem" }}>
                      Agora escolha uma das opções abaixo para finalizar o pagamento:
                    </Typography>
                    <Grid container mt={2}>
                      <Grid p={1} item xs={12} sm={6}>
                        <Stack spacing={2}>
                          <Typography variant="subtitle1" color="initial">
                            PIX Copia e Cola
                          </Typography>
                          <Stack direction={"row"} spacing={2}>
                            <ContentCopy color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              1. Copie o código abaixo
                            </Typography>
                          </Stack>
                          <Stack direction={"column"} spacing={2}>
                            <TextField size="small" fullWidth value={qrCode} disabled variant="outlined" />
                            <Button
                              style={{ color: "#FFF" }}
                              onClick={() => copyToClipboard(qrCode)}
                              endIcon={<ContentCopy />}
                              size="small"
                              variant="contained"
                            >
                              COPIAR CÓDIGO
                            </Button>
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <QrCode color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              2. Abra o aplicativo do seu banco usando o seu celular;
                            </Typography>
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <Pix color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              3. Entre na área PIX e escolha a opção PIX Copia e Cola;
                            </Typography>
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <Receipt color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              4. Ao fazer o pagamento por PIX, aparecerá na tela da transação o nome Push in Pay como
                              banco destinatário.
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid
                        p={1}
                        item
                        xs={12}
                        sm={6}
                        style={{
                          borderLeftWidth: !isMobile ? 2 : 0,
                          borderLeftColor: "#D7D7D7",
                          borderLeftStyle: "solid",
                        }}
                      >
                        <Stack spacing={2}>
                          <Typography variant="subtitle1" color="initial">
                            QR CODE
                          </Typography>
                          <Stack direction={"row"} spacing={2}>
                            <PhoneAndroid color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              1. Abra o aplicativo do seu banco usando o seu celular;
                            </Typography>
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <QrCode color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              2. Entre na área PIX e selecione a opção de pagar com QR CODE;
                            </Typography>
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <Pix color="primary" />
                            <Typography variant="subtitle2" color="initial">
                              3. Escaneie o QR Code abaixo e confirme o pagamento. O nome que vai aparecer para você é
                              Kaixinha Intermediaco e em alguns casos Tractapay Gateway E M ou Compra Segura On Line
                            </Typography>
                          </Stack>
                          <Stack direction={"row"} display={"flex"} justifyContent={"center"}>
                            <img src={`data:image/png;base64,${qrCodeImage}` || "/placeholder.svg"} style={{ maxWidth: 180 }} />
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </>
                )}
                {paymentConfirmed && (
                  <>
                    <Stack direction={"column"} display={"flex"} alignItems={"center"}>
                      <CheckCircle fontSize="large" color="success" />
                      <Typography variant="h5" color="initial">
                        Pagamento confirmado
                      </Typography>
                    </Stack>
                    <Stack direction={"column"} display={"flex"} alignItems={"center"}>
                      <Box p={2}>
                        <Button
                          fullWidth
                          color="primary"
                          variant="contained"
                          style={{ color: "#fff" }}
                          onClick={() => {
                            location.href = "/minha-conta"
                          }}
                        >
                          Ir para meu perfil
                        </Button>
                      </Box>
                    </Stack>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

function SummarySection({ campaign, image, valueOfDonation, handleOpenModal }) {
  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Resumo</Typography>
        <ExpandMore />
      </Box>

      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Box
          component="img"
          src={image}
          alt="Campaign image"
          sx={{
            width: "100%",
            maxHeight: 160,
            objectFit: "contain",
            borderRadius: 2,
          }}
        />

        <Typography variant="body2" sx={{ mt: 1 }}>
          {truncateText(campaign.title, 100)}
        </Typography>
      </Box>
    </Box>
  )
}

function ValueChangeModal({ openModal, handleCloseModal, newValue, setNewValue, handleChangeValue }) {
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: "300px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Alterar valor da doação
        </Typography>
        <TextField
          size="small"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          id="outlined-basic"
          label="Valor"
          variant="outlined"
          value={formatCurrency(newValue)}
          onChange={(e) => setNewValue(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleChangeValue}
          sx={{ textTransform: "none", color: "white" }}
        >
          Confirmar
        </Button>
      </Box>
    </Modal>
  )
}
