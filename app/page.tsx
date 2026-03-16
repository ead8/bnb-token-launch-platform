import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Zap, Flame } from 'lucide-react'
import { Suspense } from 'react'
import { TokenListServer } from '@/components/token-list'
import Loading from './loading'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-card/40 to-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Launch Your Token on BNB Chain
              </h1>
              <p className="text-lg text-muted-foreground">
                Create, launch, and manage your token with advanced features like fee sharing and auto-buyback
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/create" className="flex-1">
                <Button size="lg" className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <Zap className="h-5 w-5" />
                  Launch Token
                </Button>
              </Link>
              <Link href="/tokens" className="flex-1">
                <Button size="lg" variant="outline" className="w-full gap-2 bg-transparent">
                  <Search className="h-5 w-5" />
                  Browse Tokens
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tokens..."
                className="pl-10 py-3 text-base bg-input border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <section className="border-b border-border bg-card/30 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="text-sm text-muted-foreground">Active Tokens</div>
              <div className="mt-1 text-2xl font-bold text-foreground">2,453</div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="mt-1 text-2xl font-bold text-foreground">$245M</div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="text-sm text-muted-foreground">Total Traders</div>
              <div className="mt-1 text-2xl font-bold text-foreground">18.5K</div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="text-sm text-muted-foreground">Total Fees Shared</div>
              <div className="mt-1 text-2xl font-bold text-accent">$12.3M</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Flame className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
          </div>

          <Suspense fallback={<Loading />}>
            <TokenListServer limit={6} />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8 text-center text-muted-foreground text-sm">
        <p>© 2024 TokenLaunch. Built on BNB Chain.</p>
      </footer>
    </div>
  )
}
