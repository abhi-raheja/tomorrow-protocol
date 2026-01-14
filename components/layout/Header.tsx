'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsConnected(true);
    setWalletAddress('0x1234...abcd');
    setIsConnecting(false);
    setShowWalletModal(false);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors" />
            <span className="relative text-lg font-semibold text-white">T</span>
          </div>
          <span className="text-lg font-medium text-white">Tomorrow</span>
        </Link>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/lp"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Lend
            </Link>
            <Link
              href="/borrower"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Borrow
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Admin
            </Link>
          </nav>
        )}

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-white/80">{walletAddress}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnectWallet}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowWalletModal(true)}
              className="bg-white text-black hover:bg-white/90 font-medium px-5"
            >
              Connect
            </Button>
          )}
        </div>
      </div>

      {/* Wallet Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md bg-[#141414] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <WalletOption
              name="MetaMask"
              icon="M"
              iconBg="bg-orange-500"
              onClick={connectWallet}
              isConnecting={isConnecting}
            />
            <WalletOption
              name="WalletConnect"
              icon="W"
              iconBg="bg-blue-500"
              onClick={connectWallet}
              isConnecting={isConnecting}
            />
            <WalletOption
              name="Coinbase Wallet"
              icon="C"
              iconBg="bg-blue-600"
              onClick={connectWallet}
              isConnecting={isConnecting}
            />
            <WalletOption
              name="Phantom"
              icon="P"
              iconBg="bg-purple-500"
              onClick={connectWallet}
              isConnecting={isConnecting}
            />
          </div>
          <p className="text-xs text-white/40 text-center pb-2">
            By connecting, you agree to the Terms of Service
          </p>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function WalletOption({
  name,
  icon,
  iconBg,
  onClick,
  isConnecting,
}: {
  name: string;
  icon: string;
  iconBg: string;
  onClick: () => void;
  isConnecting: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className="flex items-center gap-4 w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all disabled:opacity-50"
    >
      <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <span className="text-white font-semibold">{icon}</span>
      </div>
      <span className="font-medium text-white">
        {isConnecting ? 'Connecting...' : name}
      </span>
    </button>
  );
}
