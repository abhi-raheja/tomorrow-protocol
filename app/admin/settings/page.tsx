'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { poolSettings } from '@/lib/dummy-data';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    targetApy: poolSettings.targetApy.toString(),
    maxFacilitySize: poolSettings.maxFacilitySize.toString(),
    liquidityBuffer: poolSettings.liquidityBuffer.toString(),
    withdrawalQueueEnabled: poolSettings.withdrawalQueueEnabled,
    premiumExitFee: poolSettings.premiumExitFee.toString(),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
    setHasChanges(false);
    toast.success('Settings saved successfully', {
      description: 'Pool parameters have been updated.',
    });
  };

  const handleReset = () => {
    setSettings({
      targetApy: poolSettings.targetApy.toString(),
      maxFacilitySize: poolSettings.maxFacilitySize.toString(),
      liquidityBuffer: poolSettings.liquidityBuffer.toString(),
      withdrawalQueueEnabled: poolSettings.withdrawalQueueEnabled,
      premiumExitFee: poolSettings.premiumExitFee.toString(),
    });
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar type="admin" />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-3xl">
          {/* Back Link */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#15191e] transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#15191e]">Pool Settings</h1>
            <p className="text-gray-500 mt-1">Configure protocol parameters</p>
          </div>

          {/* Settings Form */}
          <div className="space-y-6">
            {/* Yield Settings */}
            <section className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <h2 className="text-lg font-medium text-[#15191e] mb-6">Yield Settings</h2>

              <div className="space-y-6">
                <SettingField
                  label="Target APY"
                  description="The target annual percentage yield for LPs"
                  suffix="%"
                >
                  <Input
                    type="number"
                    value={settings.targetApy}
                    onChange={(e) => handleChange('targetApy', e.target.value)}
                    className="w-32 bg-gray-50 border-gray-200 text-[#15191e] text-right"
                    step="0.1"
                  />
                </SettingField>
              </div>
            </section>

            {/* Capacity Settings */}
            <section className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <h2 className="text-lg font-medium text-[#15191e] mb-6">Capacity Settings</h2>

              <div className="space-y-6">
                <SettingField
                  label="Max Facility Size"
                  description="Maximum total credit that can be extended to borrowers"
                  prefix="$"
                >
                  <Input
                    type="number"
                    value={settings.maxFacilitySize}
                    onChange={(e) => handleChange('maxFacilitySize', e.target.value)}
                    className="w-40 bg-gray-50 border-gray-200 text-[#15191e] text-right"
                    step="100000"
                  />
                </SettingField>

                <SettingField
                  label="Liquidity Buffer"
                  description="Minimum percentage of pool to keep liquid for withdrawals"
                  suffix="%"
                >
                  <Input
                    type="number"
                    value={settings.liquidityBuffer}
                    onChange={(e) => handleChange('liquidityBuffer', e.target.value)}
                    className="w-32 bg-gray-50 border-gray-200 text-[#15191e] text-right"
                    step="1"
                  />
                </SettingField>
              </div>
            </section>

            {/* Withdrawal Settings */}
            <section className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <h2 className="text-lg font-medium text-[#15191e] mb-6">Withdrawal Settings</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#15191e]">Withdrawal Queue</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Enable queued withdrawals when liquidity is insufficient
                    </div>
                  </div>
                  <Switch
                    checked={settings.withdrawalQueueEnabled}
                    onCheckedChange={(checked) => handleChange('withdrawalQueueEnabled', checked)}
                  />
                </div>

                <SettingField
                  label="Premium Exit Fee"
                  description="Fee charged for instant withdrawal when in queue"
                  suffix="%"
                >
                  <Input
                    type="number"
                    value={settings.premiumExitFee}
                    onChange={(e) => handleChange('premiumExitFee', e.target.value)}
                    className="w-32 bg-gray-50 border-gray-200 text-[#15191e] text-right"
                    step="0.5"
                    disabled={!settings.withdrawalQueueEnabled}
                  />
                </SettingField>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <>
                    <div className="h-2 w-2 rounded-full bg-[#ff5900]" />
                    <span className="text-sm text-[#ff5900]">Unsaved changes</span>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="border-gray-300 text-[#15191e] hover:bg-gray-100 disabled:opacity-50"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="bg-[#ff5900] hover:bg-[#e65000] text-white disabled:opacity-50 min-w-[120px]"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-700">
                  Changes to pool parameters take effect immediately. Please ensure you understand
                  the implications of any changes before saving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingField({
  label,
  description,
  prefix,
  suffix,
  children,
}: {
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="font-medium text-[#15191e]">{label}</div>
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-gray-400">{prefix}</span>}
        {children}
        {suffix && <span className="text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}
