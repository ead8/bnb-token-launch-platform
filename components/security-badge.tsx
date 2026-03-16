'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, AlertTriangle, Shield } from 'lucide-react'

interface SecurityBadgeProps {
  contractVerified: boolean
  auditStatus: 'pending' | 'passed' | 'failed' | 'not_audited'
  riskScore: number
  honeypotCheck: boolean
  rugRiskLevel: 'unknown' | 'low' | 'medium' | 'high'
  auditLink?: string
}

export function SecurityBadge({
  contractVerified,
  auditStatus,
  riskScore,
  honeypotCheck,
  rugRiskLevel,
  auditLink,
}: SecurityBadgeProps) {
  const getRiskColor = (score: number) => {
    if (score < 25) return 'bg-green-500/10 text-green-500 border-green-500/30'
    if (score < 50) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
    if (score < 75) return 'bg-orange-500/10 text-orange-500 border-orange-500/30'
    return 'bg-red-500/10 text-red-500 border-red-500/30'
  }

  const getAuditIcon = () => {
    switch (auditStatus) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRugRiskColor = () => {
    switch (rugRiskLevel) {
      case 'low':
        return 'text-green-500'
      case 'medium':
        return 'text-yellow-500'
      case 'high':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card className="border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Token Security
        </h3>
        <div className={`rounded-full px-3 py-1 text-sm font-semibold ${getRiskColor(riskScore)}`}>
          Risk: {riskScore}/100
        </div>
      </div>

      <div className="space-y-3">
        {/* Contract Verification */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Contract Verified</span>
          {contractVerified ? (
            <span className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-4 w-4" />
              Yes
            </span>
          ) : (
            <span className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="h-4 w-4" />
              No
            </span>
          )}
        </div>

        {/* Audit Status */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Audit Status</span>
          <div className="flex items-center gap-2">
            {getAuditIcon()}
            <span className="capitalize text-foreground">{auditStatus}</span>
            {auditLink && (
              <a
                href={auditLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs ml-2"
              >
                View
              </a>
            )}
          </div>
        </div>

        {/* Honeypot Check */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Honeypot Check</span>
          {honeypotCheck ? (
            <span className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-4 w-4" />
              Safe
            </span>
          ) : (
            <span className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              Suspicious
            </span>
          )}
        </div>

        {/* Rug Risk */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Rug Risk Level</span>
          <span className={`capitalize font-semibold ${getRugRiskColor()}`}>
            {rugRiskLevel}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        This security information is provided for reference only. Always conduct your own research before investing.
      </p>
    </Card>
  )
}
