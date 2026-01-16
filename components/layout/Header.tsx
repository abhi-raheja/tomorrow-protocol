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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <TomorrowLogo />
          <span className="text-lg font-semibold text-[#15191e]">Tomorrow</span>
        </Link>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/lp"
              className="px-4 py-2 text-lg font-medium text-gray-600 hover:text-[#15191e] transition-colors rounded-lg hover:bg-gray-50"
            >
              Earn
            </Link>
            <Link
              href="/borrower"
              className="px-4 py-2 text-lg font-medium text-gray-600 hover:text-[#15191e] transition-colors rounded-lg hover:bg-gray-50"
            >
              Borrow
            </Link>
          </nav>
        )}

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-700">{walletAddress}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnectWallet}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-gray-300 text-[#15191e] hover:bg-gray-100 font-medium px-5"
              >
                Get Help
              </Button>
              <Button
                onClick={() => setShowWalletModal(true)}
                className="bg-[#ff5900] hover:bg-[#e65000] text-white font-medium px-5"
              >
                Enter App
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Wallet Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#15191e]">Connect Wallet</DialogTitle>
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
          <p className="text-xs text-gray-400 text-center pb-2">
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
      className="flex items-center gap-4 w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all disabled:opacity-50"
    >
      <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <span className="text-white font-semibold">{icon}</span>
      </div>
      <span className="font-medium text-[#15191e]">
        {isConnecting ? 'Connecting...' : name}
      </span>
    </button>
  );
}

function TomorrowLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="16" fill="#ff5900" />

      {/* Horizon line */}
      <path
        d="M6 20 Q16 14 26 20"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Rising sun */}
      <circle cx="16" cy="14" r="5" fill="white" />

      {/* Sun rays */}
      <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <line x1="16" y1="6" x2="16" y2="4" />
        <line x1="21" y1="9" x2="22.5" y2="7.5" />
        <line x1="23" y1="14" x2="25" y2="14" />
        <line x1="11" y1="9" x2="9.5" y2="7.5" />
        <line x1="9" y1="14" x2="7" y2="14" />
      </g>

      {/* Upward arrow beneath horizon */}
      <path
        d="M16 28 L16 23 M13 25.5 L16 23 L19 25.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}
