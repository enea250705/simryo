"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === "/admin/login") return
    const token = localStorage.getItem("admin_token")
    const cookieToken = document.cookie.includes("admin_token=")
    if (!token && !cookieToken) {
      router.push("/admin/login")
    }
  }, [pathname, router])

  return <>{children}</>
}
