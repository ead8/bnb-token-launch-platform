'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function CreateTokenPage() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    image: null as File | null,
    totalSupply: '',
    taxRate: '5',
    feeSharing: {
      twitter: false,
      github: false,
      tiktok: false,
      twitch: false,
    },
  })

  const [step, setStep] = useState(1)
  const [previewImage, setPreviewImage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFeeShareChange = (platform: keyof typeof formData.feeSharing) => {
    setFormData((prev) => ({
      ...prev,
      feeSharing: {
        ...prev.feeSharing,
        [platform]: !prev.feeSharing[platform],
      },
    }))
  }

  const isStep1Valid = formData.name && formData.symbol && formData.description
  const isStep2Valid = formData.totalSupply

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card/30 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Create Your Token</h1>
          <p className="mt-2 text-muted-foreground">Launch your token on BNB Chain in just a few steps</p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                    s <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
                  {s === 1 && 'Basic Info'}
                  {s === 2 && 'Supply'}
                  {s === 3 && 'Settings'}
                </span>
                {s < 3 && <div className="mx-2 h-1 w-12 bg-muted sm:w-24" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card className="border border-border bg-card p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground">Token Name *</label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="e.g., Rocket Fuel"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-2 bg-input border-border"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">This cannot be changed later</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground">Symbol *</label>
                      <Input
                        type="text"
                        name="symbol"
                        placeholder="e.g., RF"
                        maxLength={10}
                        value={formData.symbol}
                        onChange={handleInputChange}
                        className="mt-2 bg-input border-border uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground">Token Logo</label>
                      <div className="mt-2 relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center justify-center h-10 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors"
                        >
                          {previewImage ? (
                            <img src={previewImage || "/placeholder.svg"} alt="Preview" className="h-full w-full object-contain rounded" />
                          ) : (
                            <span className="text-xs text-muted-foreground">Choose image</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground">Description *</label>
                    <textarea
                      name="description"
                      placeholder="Tell us about your token..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{formData.description.length}/500</p>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                      <Link href="/">Cancel</Link>
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next
                    </Button>
                  </div>
                </Card>
              )}

              {step === 2 && (
                <Card className="border border-border bg-card p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground">Total Supply *</label>
                    <div className="mt-2 relative">
                      <Input
                        type="number"
                        name="totalSupply"
                        placeholder="1000000"
                        value={formData.totalSupply}
                        onChange={handleInputChange}
                        className="bg-input border-border"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Tokens</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Total number of tokens to create</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground">Tax Rate *</label>
                    <select
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground cursor-pointer"
                    >
                      <option value="1">1% Tax</option>
                      <option value="3">3% Tax</option>
                      <option value="5" selected>
                        5% Tax
                      </option>
                      <option value="10">10% Tax</option>
                    </select>
                    <p className="mt-1 text-xs text-muted-foreground">Transaction fee applied to each trade</p>
                  </div>

                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">Snowball Feature</p>
                        <p className="mt-1 text-muted-foreground">Auto-buyback & burn mechanism will be enabled for all tokens</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next
                    </Button>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="border border-border bg-card p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-4">Fee Sharing Platforms</label>
                    <p className="text-sm text-muted-foreground mb-4">Select which platforms you want to integrate for fee sharing:</p>

                    <div className="space-y-3">
                      {[
                        { key: 'twitter', label: 'Twitter', icon: '𝕏' },
                        { key: 'github', label: 'GitHub', icon: '⚙️' },
                        { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                        { key: 'twitch', label: 'Twitch', icon: '📺' },
                      ].map((platform) => (
                        <div
                          key={platform.key}
                          onClick={() => handleFeeShareChange(platform.key as keyof typeof formData.feeSharing)}
                          className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 cursor-pointer transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          <input
                            type="checkbox"
                            checked={formData.feeSharing[platform.key as keyof typeof formData.feeSharing]}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-border"
                          />
                          <span className="text-lg">{platform.icon}</span>
                          <label className="flex-1 cursor-pointer">
                            <p className="font-semibold text-foreground">{platform.label}</p>
                            <p className="text-xs text-muted-foreground">Earn fees when your followers trade</p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <p className="text-sm text-green-400">
                      ✓ Your token will be ready to launch with all selected features enabled
                    </p>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Launch Token
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Summary Sidebar */}
            <div>
              <Card className="border border-border bg-card p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Summary</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Token Name</p>
                    <p className="font-semibold text-foreground">{formData.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Symbol</p>
                    <p className="font-semibold text-foreground">{formData.symbol || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Supply</p>
                    <p className="font-semibold text-foreground">
                      {formData.totalSupply ? `${parseInt(formData.totalSupply).toLocaleString()}` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax Rate</p>
                    <p className="font-semibold text-foreground">{formData.taxRate}%</p>
                  </div>

                  {Object.entries(formData.feeSharing).some(([_, v]) => v) && (
                    <div className="border-t border-border pt-3">
                      <p className="text-muted-foreground mb-2">Fee Sharing</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formData.feeSharing).map(([platform, enabled]) => (
                          enabled && (
                            <span key={platform} className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Estimated Launch Cost</p>
                  <p className="text-lg font-bold text-primary">0.5 BNB</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
