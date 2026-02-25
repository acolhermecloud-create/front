import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export function useUtm() {
  const router = useRouter()
  const [utm, setUtm] = useState({})

  useEffect(() => {
    if (!router.isReady) return

    const params = new URLSearchParams(window.location.search)

    const data = {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
      utm_id: params.get("utm_id") || "",
      fbclid: params.get("fbclid") || "",
      gclid: params.get("gclid") || "",
      sub1: params.get("sub1") || "",
    }

    const hasAny = Object.values(data).some((v) => v)

    if (hasAny) {
      localStorage.setItem("utm", JSON.stringify(data))
      setUtm(data)
      return
    }

    const stored = localStorage.getItem("utm")
    if (stored) setUtm(JSON.parse(stored))
  }, [router.isReady])

  return utm
}