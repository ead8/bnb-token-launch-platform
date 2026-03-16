'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Share2, DollarSign } from 'lucide-react'
import { useState } from 'react'

interface ReferralStats {
  referralLink: string
  totalReferrals: number
  pendingRewards: number
  claimedRewards: number
  rewardRate: number // percentage
}

interface ReferralProps {
  stats: ReferralStats
}

export function ReferralSystem({ stats }: ReferralProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stats.referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    const text = `Join me on TokenLaunch! Launch and trade tokens on BNB Chain. Use my referral link: ${stats.referralLink}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Referral Program</h2>
        <p className="mt-1 text-muted-foreground">Earn {stats.rewardRate}% commission on every friend who joins</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Referrals</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalReferrals}</div>
        </Card>

        <Card className="border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Pending Rewards</div>
          <div className="mt-2 text-3xl font-bold text-yellow-500">
            ${stats.pendingRewards.toLocaleString()}
          </div>
        </Card>

        <Card className="border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Claimed Rewards</div>
          <div className="mt-2 text-3xl font-bold text-green-500">
            ${stats.claimedRewards.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Your Referral Link</h3>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-border bg-input p-3 font-mono text-sm text-foreground break-all">
            {stats.referralLink}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            onClick={shareToTwitter}
          >
            <Share2 className="h-4 w-4" />
            Share on Twitter
          </Button>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-foreground">How It Works</h3>
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
              1
            </div>
            <div>
              <div className="font-semibold text-foreground">Share Your Link</div>
              <p className="text-sm text-muted-foreground">Send your unique referral link to friends</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
              2
            </div>
            <div>
              <div className="font-semibold text-foreground">They Sign Up</div>
              <p className="text-sm text-muted-foreground">Your friends use your link and connect their wallet</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
              3
            </div>
            <div>
              <div className="font-semibold text-foreground">Earn Rewards</div>
              <p className="text-sm text-muted-foreground">Get {stats.rewardRate}% commission on their trading fees</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
              4
            </div>
            <div>
              <div className="font-semibold text-foreground">Claim Rewards</div>
              <p className="text-sm text-muted-foreground">Claim your rewards in BNB or tokens anytime</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Claim Button */}
      {stats.pendingRewards > 0 && (
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 py-3 text-base" size="lg">
          <DollarSign className="h-5 w-5" />
          Claim ${stats.pendingRewards.toLocaleString()} in Rewards
        </Button>
      )}
    </div>
  )
}
