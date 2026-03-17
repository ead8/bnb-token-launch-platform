'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Wallet, LogOut } from 'lucide-react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tokens', label: 'Tokens' },
    { href: '/create', label: 'Create' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/profile', label: 'Profile' },
  ]

  const formatAddress = (addr?: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async () => {
    await open()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <img src="/launchpad-logo.png" alt="LaunchPad" className="h-10 w-10 object-contain" />
            <span className="hidden font-bold text-foreground sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">LaunchPad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Connect Button */}
          <div className="hidden items-center gap-4 md:flex">
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {formatAddress(address)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => disconnect()}
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={handleConnect}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="space-y-2 border-t border-border py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isConnected && address ? (
              <Button
                className="w-full gap-2 bg-transparent"
                variant="outline"
                onClick={() => {
                  disconnect()
                  setIsOpen(false)
                }}
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            ) : (
              <Button
                className="w-full gap-2 bg-primary hover:bg-primary/90"
                onClick={() => {
                  handleConnect()
                  setIsOpen(false)
                }}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
