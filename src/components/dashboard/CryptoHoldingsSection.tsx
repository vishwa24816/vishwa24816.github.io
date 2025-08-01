
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import type { PortfolioHolding, Stock } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin, XCircle, Coins, Landmark, Settings2, ChevronDown, BarChart2, LayoutGrid, List, PieChart, ArrowUpRight, ArrowDownLeft, History, Snowflake, QrCode, Copy, ArrowUpCircle, ArrowDownCircle, Flame } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FundTransferDialog } from '@/components/shared/FundTransferDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export type WalletMode = 'hot' | 'cold';
type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';

interface CryptoHoldingsSectionProps {
  holdings: PortfolioHolding[];
  title: string;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
  isRealMode?: boolean;
  isPledged?: boolean;
  walletMode: WalletMode;
  setWalletMode: React.Dispatch<React.SetStateAction<WalletMode>>;
  onAssetClick: (asset: Stock) => void;
  onAddFunds?: () => void;
}

const mockTransactions = [
  { id: 't1', type: 'receive', asset: 'Bitcoin', symbol: 'BTC', amountCrypto: 0.05, amountINR: 260000, date: '2024-07-22', status: 'Completed' },
  { id: 't2', type: 'send', asset: 'Ethereum', symbol: 'ETH', amountCrypto: 0.5, amountINR: 142500, date: '2024-07-21', status: 'Completed' },
  { id: 't3', type: 'receive', asset: 'Solana', symbol: 'SOL', amountCrypto: 10, amountINR: 136000, date: '2024-07-20', status: 'Completed' },
  { id: 't4', type: 'send', asset: 'Bitcoin', symbol: 'BTC', amountCrypto: 0.01, amountINR: 52000, date: '2024-07-19', status: 'Pending' },
];


export function CryptoHoldingsSection({
  holdings,
  title,
  cashBalance,
  setCashBalance,
  mainPortfolioCashBalance,
  setMainPortfolioCashBalance,
  isRealMode = false,
  isPledged = false,
  walletMode,
  setWalletMode,
  onAssetClick,
  onAddFunds,
}: CryptoHoldingsSectionProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);
  const [pledgeDialogMode, setPledgeDialogMode] = useState<'pledge' | 'payback'>('pledge');

  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>(holdings[0]?.symbol || '');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  
  const [walletAddresses, setWalletAddresses] = useState<Record<string, string>>({});


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const generateNewAddress = (symbol: string) => {
      const existing = walletAddresses[symbol];
      if (existing) return existing;
      const newAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setWalletAddresses(prev => ({ ...prev, [symbol]: newAddress }));
      return newAddress;
  }

  const handlePledgeClick = (holding: PortfolioHolding, mode: 'pledge' | 'payback') => {
    setSelectedHoldingForPledge(holding);
    setPledgeDialogMode(mode);
    setPledgeDialogOpen(true);
  };

  const handleConfirmPledge = (holding: PortfolioHolding, quantity: number, mode: 'pledge' | 'payback') => {
      const actionText = mode === 'pledge' ? 'Pledged' : 'Payback initiated for';
      toast({
          title: "Action Submitted (Mock)",
          description: `${actionText} ${quantity} units of ${holding.symbol}.`,
      });
      setPledgeDialogOpen(false);
  };

  const totalCurrentValue = holdings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = holdings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;

  const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  const handleOpenFundTransferDialog = (direction: 'toCrypto' | 'fromCrypto') => {
    setTransferDirection(direction);
    setIsFundTransferDialogOpen(true);
  };

  const handleTransferConfirm = (amount: number, direction: 'toCrypto' | 'fromCrypto') => {
    if (direction === 'toCrypto') {
      setMainPortfolioCashBalance(prev => prev - amount);
      setCashBalance(prev => prev + amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to ${title}.` });
    } else { // fromCrypto
      setMainPortfolioCashBalance(prev => prev + amount);
      setCashBalance(prev => prev - amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to Main Portfolio.` });
    }
  };
  
  const closeAllPopups = () => {
    setIsSending(false);
    setIsReceiving(false);
    setIsHistoryVisible(false);
  };

  const handleSendClick = () => {
    closeAllPopups();
    if(holdings.length > 0) setSelectedAssetSymbol(holdings[0].symbol || '');
    setIsSending(true);
    setRecipientAddress('');
    setSendAmount('');
  };

  const handleReceiveClick = () => {
    closeAllPopups();
    const firstSymbol = holdings[0]?.symbol || '';
    if(firstSymbol) {
        setSelectedAssetSymbol(firstSymbol);
        generateNewAddress(firstSymbol); // Pre-generate address for the default selection
    }
    setIsReceiving(true);
  };

  const handleHistoryClick = () => {
    closeAllPopups();
    setIsHistoryVisible(true);
  };
  
  const handleReceiveAssetChange = (symbol: string) => {
    setSelectedAssetSymbol(symbol);
    generateNewAddress(symbol);
  };

  const handleConfirmSend = () => {
    if (!recipientAddress || !sendAmount || !selectedAssetSymbol) {
        toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
        return;
    }
    toast({
        title: "Send Initiated (Mock)",
        description: `Sending ${sendAmount} ${selectedAssetSymbol} to ${recipientAddress}.`,
    });
    setIsSending(false);
  };

  const handleCopyAddress = () => {
    const addressToCopy = walletAddresses[selectedAssetSymbol];
    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy);
      toast({ title: "Address Copied", description: `Your ${selectedAssetSymbol} wallet address has been copied.`});
    }
  }

  const walletCardTitle = 'Crypto Wallet';
  const holdingsCardTitle = 'Crypto & Web3 Holdings';

  const chartData = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      fill: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`,
      label: pos.profitAndLoss >= 0 ? 'Profit' : 'Loss'
    }));
  }, [holdings]);

  const chartConfig = {
      value: {
        label: 'Current Value',
      },
      ...holdings.reduce((acc, pos) => {
        acc[pos.symbol || pos.name] = {
            label: pos.symbol || pos.name,
            color: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`
        };
        return acc;
    }, {} as any)
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      pnl: pos.profitAndLoss,
      pnlPercent: pos.profitAndLossPercent,
    }));
  }, [holdings]);

  const renderContent = () => {
    if (holdings.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          You have no crypto assets in this wallet.
        </div>
      );
    }
    switch(viewMode) {
      case 'list':
        return (
          <div className="mt-4">
            {holdings.map((holding) => (
              <HoldingCard 
                  key={holding.id} 
                  holding={holding} 
                  onPledgeClick={handlePledgeClick}
                  isPledged={isPledged}
                  onAssetClick={onAssetClick}
              />
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="w-full h-[300px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.ResponsiveContainer>
                <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} tickLine={false} axisLine={false} />
                  <Chart.Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))'
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Chart.Legend content={<Chart.LegendContent />} />
                  <Chart.Bar dataKey="value" radius={4} />
                </Chart.BarChart>
              </Chart.ResponsiveContainer>
            </Chart.Container>
          </div>
        );
      case 'heatmap':
        return (
          <div className="w-full h-[300px] mt-4">
            <PortfolioHeatmap items={heatmapData} />
          </div>
        );
      case 'pie':
        return (
          <div className="w-full h-[300px] mt-4 flex items-center justify-center">
            <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.ResponsiveContainer>
                <Chart.PieChart>
                    <Chart.Tooltip 
                      content={<Chart.TooltipContent hideLabel nameKey="name" />}
                      formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`}
                    />
                    <Chart.Pie data={chartData} dataKey="value" nameKey="name" />
                    <Chart.LegendContent />
                </Chart.PieChart>
              </Chart.ResponsiveContainer>
            </Chart.Container>
          </div>
        );
      default:
        return null;
    }
  };


  if(isPledged) {
    return (
        <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Bitcoin className="h-6 w-6 mr-2" /> {title}
                </CardTitle>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                    <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                    <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                    <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 pt-2 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                        <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(overallPandL)}
                        </p>
                        <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                        </div>
                        <div className="text-right">
                        <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(totalDayChangeAbsolute)}
                        </p>
                        <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Total Pledged Value</p>
                        <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Current Value</p>
                        <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                        </div>
                    </div>
                </div>
                 {holdings.length > 0 ? (
                    renderContent()
                ) : (
                     <div className="text-center py-10 text-muted-foreground">
                        <p>No Pledged {title.includes('Web3') ? 'Web3' : 'Crypto'} Holdings.</p>
                    </div>
                )}
            </CardContent>
             {selectedHoldingForPledge && (
                <PledgeDialog
                    isOpen={pledgeDialogOpen}
                    onOpenChange={setPledgeDialogOpen}
                    holding={selectedHoldingForPledge}
                    onConfirmPledge={handleConfirmPledge}
                    currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'INR' : 'INR'}
                    mode={pledgeDialogMode}
                />
            )}
        </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="w-full shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Bitcoin className="h-6 w-6 mr-2" /> {walletCardTitle}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs flex items-center gap-2"
              onClick={() => setWalletMode(prev => (prev === 'cold' ? 'hot' : 'cold'))}
            >
              {walletMode === 'cold' ? <Snowflake className="h-4 w-4 text-blue-500" /> : <Flame className="h-4 w-4 text-red-500" />}
              <span className="capitalize">{walletMode} Wallet</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(overallPandL)}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(totalDayChangeAbsolute)}
                  </p>
                  <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Total Investment</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Current Value</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Cash Balance</p>
                    <p className="font-medium text-foreground">{formatCurrency(cashBalance)}</p>
                </div>
                 <div className="pt-3 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-11" onClick={() => onAddFunds ? onAddFunds() : handleOpenFundTransferDialog('toCrypto')}>
                        <Coins className="mr-2 h-4 w-4" /> Add Funds
                    </Button>
                    <Button variant="outline" size="sm" className="h-11" onClick={() => onAddFunds ? onAddFunds() : handleOpenFundTransferDialog('fromCrypto')}>
                        <Landmark className="mr-2 h-4 w-4" /> Withdraw
                    </Button>
                </div>
                {!isRealMode && (
                    <>
                        <div className="pt-3 grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" className="flex-col h-14" onClick={handleSendClick} disabled={walletMode === 'cold'}>
                                <ArrowUpRight className="h-5 w-5 mb-1" />
                                <span className="text-xs">Send</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-col h-14" onClick={handleReceiveClick} disabled={walletMode === 'cold'}>
                                <ArrowDownLeft className="h-5 w-5 mb-1" />
                                <span className="text-xs">Receive</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-col h-14" onClick={handleHistoryClick} disabled={walletMode === 'cold'}>
                                <History className="h-5 w-5 mb-1" />
                                <span className="text-xs">History</span>
                            </Button>
                        </div>
                        {isSending && (
                            <div className="p-4 border-t mt-4 space-y-4 animate-accordion-down">
                                <h4 className="text-md font-semibold text-foreground">Send Crypto</h4>
                                <div className="space-y-2">
                                  <Label htmlFor="send-asset">Asset</Label>
                                  <Select value={selectedAssetSymbol} onValueChange={setSelectedAssetSymbol}>
                                      <SelectTrigger id="send-asset">
                                          <SelectValue placeholder="Select an asset" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {holdings.map(h => <SelectItem key={h.symbol} value={h.symbol!}>{h.name} ({h.symbol})</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="send-amount">Amount</Label>
                                    <Input id="send-amount" type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="e.g. 0.01" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="recipient-address">Recipient Address</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="recipient-address" type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="Enter wallet address" className="flex-grow" />
                                        <Button variant="outline" size="icon" onClick={() => toast({ title: "QR Scan (WIP)"})}>
                                            <QrCode className="h-5 w-5" />
                                            <span className="sr-only">Scan QR Code</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={closeAllPopups}>Cancel</Button>
                                    <Button onClick={handleConfirmSend}>Confirm Send</Button>
                                </div>
                            </div>
                        )}
                         {isReceiving && (
                            <div className="p-4 border-t mt-4 space-y-4 text-center animate-accordion-down">
                                <h4 className="text-md font-semibold text-foreground">Receive Crypto</h4>
                                <div className="space-y-2 text-left">
                                  <Label htmlFor="receive-asset">Select Asset to Receive</Label>
                                  <Select value={selectedAssetSymbol} onValueChange={handleReceiveAssetChange}>
                                      <SelectTrigger id="receive-asset">
                                          <SelectValue placeholder="Select an asset" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {holdings.map(h => <SelectItem key={h.symbol} value={h.symbol!}>{h.name} ({h.symbol})</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-center my-4">
                                  <Image
                                      src={`https://placehold.co/200x200.png?text=${selectedAssetSymbol}`}
                                      alt="Your wallet QR code"
                                      width={160}
                                      height={160}
                                      data-ai-hint="qr code"
                                      className="rounded-lg border p-2"
                                  />
                                </div>
                                <div className="space-y-2 text-left">
                                    <Label>Your {selectedAssetSymbol} Address</Label>
                                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-xs font-mono break-all">
                                      <span className="flex-grow">{walletAddresses[selectedAssetSymbol] || 'Generating...'}</span>
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyAddress}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="ghost" onClick={closeAllPopups}>Done</Button>
                                </div>
                            </div>
                        )}
                        {isHistoryVisible && (
                          <div className="p-4 border-t mt-4 space-y-2 animate-accordion-down">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-md font-semibold text-foreground">Transaction History</h4>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeAllPopups}><XCircle className="h-5 w-5" /></Button>
                            </div>
                            <div className="space-y-3">
                              {mockTransactions.map(tx => (
                                <div key={tx.id} className="flex items-center gap-3">
                                  {tx.type === 'receive' ? <ArrowDownCircle className="h-6 w-6 text-green-500 shrink-0"/> : <ArrowUpCircle className="h-6 w-6 text-red-500 shrink-0"/>}
                                  <div className="flex-grow">
                                    <p className="font-medium text-sm capitalize">{tx.type} {tx.asset}</p>
                                    <p className="text-xs text-muted-foreground">{tx.date} - <span className={cn("capitalize", tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-500')}>{tx.status}</span></p>
                                  </div>
                                  <div className="text-right">
                                    <p className={cn("font-semibold text-sm", tx.type === 'receive' ? 'text-green-600' : 'text-red-500')}>
                                      {tx.type === 'receive' ? '+' : '-'} {tx.amountCrypto} {tx.symbol}
                                    </p>
                                    <p className="text-xs text-muted-foreground">≈ {formatCurrency(tx.amountINR)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Coins className="h-6 w-6 mr-2" /> {holdingsCardTitle}
                </CardTitle>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                    <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                    <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                    <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </div>

      <FundTransferDialog
        isOpen={isFundTransferDialogOpen}
        onOpenChange={setIsFundTransferDialogOpen}
        transferDirection={transferDirection}
        mainPortfolioCashBalance={mainPortfolioCashBalance}
        cryptoCashBalance={cashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={'INR'}
      />
      {selectedHoldingForPledge && (
        <PledgeDialog
            isOpen={pledgeDialogOpen}
            onOpenChange={setPledgeDialogOpen}
            holding={selectedHoldingForPledge}
            onConfirmPledge={handleConfirmPledge}
            currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'INR' : 'INR'}
            mode={pledgeDialogMode}
        />
      )}
    </>
  );
}
