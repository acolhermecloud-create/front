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
} from "@mui/material"
import { ExpandMore, CheckCircle, Pix, QrCode, ContentCopy, Receipt, PhoneAndroid } from "@mui/icons-material"
import { formatCurrency, truncateText, validateCNPJ, validateCPF, validateEmail } from "@/utils/functions"
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
  const { id, value, image } = router.query

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
  const [campaign, setCampaign] = useState(null)
  const [valueOfDonation, setValueOfDonation] = useState("0")
  const [newValue, setNewValue] = useState("0")
  const [openModal, setOpenModal] = useState(false)
  const [fillContact, setFillContact] = useState(false)
  const [fillPayment, setFillPayment] = useState(false)
  const [fillPaymentMethod, setFillPaymentMethod] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("Pix")
  const [donateAsCompany, setDonateAsCompany] = useState(false)
  const [anonymousDonation, setAnonymousDonation] = useState(false)

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
      setExpanded("panel3")

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
    if (isMounted.current && id && value) {
      isMounted.current = false
      getCampaignDetails(id)
      setValueOfDonation(value)

      // Track page view on initial load
      trackPageView({
        value: Number.parseFloat((Number.parseInt(value) / 100).toFixed(2)),
        currency: "BRL",
        contentName: id,
        contentCategory: "donation",
        eventId: `pageview_${id}_${Date.now()}`,
      })

      const trackingData = getTrackingData()

      trackPageView({
        value: trackingData.value,
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

  const validateForm = () => {
    const newErrors = {}
    if (!name) newErrors.name = "Nome é obrigatório"
    if (!email || !validateEmail(email)) newErrors.email = "E-mail válido é obrigatório"

    if (!document || document === "") {
      newErrors.document = "CPF/CNPJ é obrigatório"
    }

    if (document.replace(/\D/g, "").length === 11) {
      if (!validateCPF(document.replace(/\D/g, ""))) {
        newErrors.document = "CPF/CNPJ é obrigatório"
      }
    } else if (document.replace(/\D/g, "").length === 14) {
      if (!validateCNPJ(document.replace(/\D/g, ""))) {
        newErrors.document = "CPF/CNPJ é obrigatório"
      }
    } else {
      newErrors.document = "CPF/CNPJ é obrigatório"
    }

    if (!phone || !isValidPhoneNumber(phone)) newErrors.phone = "Telefone válido é obrigatório"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveContact = async () => {
    const validateFormData = validateForm()
    if (validateFormData) {
      setFillContact(true)

      // Track contact completion only if we have sufficient data
      const trackingData = getTrackingData()
      if (trackingData.email || trackingData.phone) {
        await sendEventToFacebook("CompleteRegistration", {
          ...trackingData,
          eventId: `contact_complete_${campaign?.slug || id}_${Date.now()}`,
        })
      }

      handleChangePanel("panel2")(null, true)
    }
  }

  if (loading || !campaign) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <Box
        sx={{
          py: 3,
          px: 0.5,
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

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
              Finalizar Pagamento
            </Typography>

            <ContactForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              document={document}
              setDocument={setDocument}
              phone={phone}
              setPhone={setPhone}
              donateAsCompany={donateAsCompany}
              setDonateAsCompany={setDonateAsCompany}
              anonymousDonation={anonymousDonation}
              setAnonymousDonation={setAnonymousDonation}
              errors={errors}
              fillContact={fillContact}
              handleSaveContact={handleSaveContact}
              expanded={expanded}
              handleChange={handleChangePanel}
            />

            <PaymentForm
              fillPayment={fillPayment}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              paymentMethods={paymentMethods}
              expanded={expanded}
              handleChange={handleChangePanel}
            />

            <PaymentPixData
              qrCodeImage={qrCodeImage}
              qrCode={qrCode}
              fillPaymentMethod={fillPaymentMethod}
              paymentConfirmed={paymentConfirmed}
              expanded={expanded}
              handleChange={handleChangePanel}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SummarySection
              campaign={campaign}
              image={image}
              valueOfDonation={valueOfDonation}
              handleOpenModal={handleOpenModal}
            />
          </Grid>
        </Grid>
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

      <Card sx={{ mb: 3 }}>
        <CardMedia component="img" height="140" image={image} alt="Campaign image" style={{ objectFit: "contain" }} />
        <CardContent>
          <Typography variant="body2" gutterBottom>
            {truncateText(campaign.title, 100)}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Valor:</Typography>
        <Typography variant="h6">R$ {formatCurrency(valueOfDonation)}</Typography>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          borderColor: "primary.main",
          color: "primary.main",
          py: 1.5,
          textTransform: "none",
        }}
        onClick={handleOpenModal}
      >
        Alterar valor
      </Button>
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
