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
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/10 via-card/40 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-block rounded-full bg-primary/20 px-4 py-1 text-sm font-semibold text-primary">
                Premium Token Launching on BNB Chain
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Launch Your Token with Confidence
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                LaunchPad is the premium platform to launch, manage, and grow your tokens with industry-leading tools, analytics, and community features.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 pt-4">
              <Link href="/create">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition-all">
                  <Zap className="h-5 w-5" />
                  Launch Token Now
                </Button>
              </Link>
              <Link href="/tokens">
                <Button size="lg" variant="outline" className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/5">
                  <Search className="h-5 w-5" />
                  Explore Tokens
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
