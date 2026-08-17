import { Navigate, useLocation, useNavigate } from "react-router"
import { RefundSuccess } from "@/components/modules/refund/RefundSuccess"
import type { RefundResult } from "@/components/modules/refund/types"

export function RefundReceipt() {
  const location = useLocation()
  const navigate = useNavigate()
  const refund = location.state?.refund as RefundResult | undefined

  if (!refund) {
    return <Navigate to="/app/refund" replace />
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <RefundSuccess
        result={refund}
        onReset={() => navigate("/app/refund")}
        onPrint={() => window.print()}
      />
    </main>
  )
}

export default RefundReceipt
