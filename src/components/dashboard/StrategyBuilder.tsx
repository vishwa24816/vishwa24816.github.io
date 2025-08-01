
"use client";

import React, { useState } from 'react';
import type { SelectedOptionLeg } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Copy, BarChart2 as PayoffIcon, BookOpen, Scaling } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ChartContainer, Chart } from "@/components/ui/chart";
import { EditLegForm } from './EditLegForm'; 
import { SwipeButton } from '@/components/ui/swipe-button';


interface StrategyBuilderProps {
  legs: SelectedOptionLeg[];
  setLegs: React.Dispatch<React.SetStateAction<SelectedOptionLeg[]>>;
}

const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Mock data for payoff chart
const generatePayoffData = (legs: SelectedOptionLeg[]) => {
  if (legs.length === 0) return [];
  
  const basePrice = legs.length > 0 ? legs[0].strikePrice : 21500;
  const range = basePrice * 0.1;
  const step = range / 20;

  const data = [];
  for (let i = -20; i <= 20; i++) {
    const underlyingPrice = basePrice + i * step;
    let pnl = 0;

    legs.forEach(leg => {
      let intrinsicValue = 0;
      if (leg.optionType === 'Call') {
        intrinsicValue = Math.max(0, underlyingPrice - leg.strikePrice);
      } else { // Put
        intrinsicValue = Math.max(0, leg.strikePrice - underlyingPrice);
      }

      if (leg.action === 'Buy') {
        pnl += intrinsicValue - leg.ltp;
      } else { // Sell
        pnl += leg.ltp - intrinsicValue;
      }
    });
    
    data.push({
      price: parseFloat(underlyingPrice.toFixed(2)),
      pnl: parseFloat((pnl * (legs[0]?.quantity || 1) * 50).toFixed(2)), // Assuming lot size 50
    });
  }
  return data;
};


export function StrategyBuilder({ legs, setLegs }: StrategyBuilderProps) {
    const { toast } = useToast();
    const [editingLegId, setEditingLegId] = useState<string | null>(null);
    const [strategyName, setStrategyName] = useState('');

    const removeLeg = (id: string) => {
        setLegs(legs.filter(leg => leg.id !== id));
        toast({ title: 'Leg Removed', description: 'The option leg has been removed from the strategy.' });
    };
    
    const handleUpdateLeg = (updatedLeg: SelectedOptionLeg) => {
        setLegs(prevLegs => prevLegs.map(leg => (leg.id === updatedLeg.id ? updatedLeg : leg)));
        setEditingLegId(null);
        toast({ title: 'Leg Updated', description: `${updatedLeg.instrumentName} has been updated.` });
    };
    
    const handleStrategyPlacement = () => {
        toast({
            title: "Strategy Placed (Mock)",
            description: `${strategyName || 'Your custom strategy'} has been sent for execution.`,
        });
    };

    const payoffData = React.useMemo(() => generatePayoffData(legs), [legs]);

    // Greeks calculations
    const totalGreeks = React.useMemo(() => {
        return legs.reduce((totals, leg) => {
            const multiplier = (leg.action === 'Buy' ? 1 : -1) * leg.quantity;
            return {
                delta: totals.delta + (leg.delta ?? 0) * multiplier,
                gamma: totals.gamma + (leg.gamma ?? 0) * multiplier,
                theta: totals.theta + (leg.theta ?? 0) * multiplier,
                vega: totals.vega + (leg.vega ?? 0) * multiplier,
            };
        }, { delta: 0, gamma: 0, theta: 0, vega: 0 });
    }, [legs]);


    // Placeholder calculations
    const lotSize = 50; 
    const estimatedMargin = legs.reduce((acc, leg) => acc + (leg.ltp * leg.quantity * lotSize) * (leg.action === 'Sell' ? 0.25 : 0.05), 0);
    const maxProfit = legs.length > 0 ? 2874 : 0;
    const maxLoss = legs.length > 0 ? -57126 : 0;
    const totalPnl = legs.reduce((acc, leg) => acc + (leg.action === 'Buy' ? -leg.ltp : leg.ltp) * leg.quantity * lotSize, 0);

    return (
        <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Strategy Builder</h2>
            {legs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/50 rounded-lg">
                    <p>Click on an option in the chain above to start building your strategy.</p>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-4 space-y-4">
                        
                        {legs.length >= 2 && (
                             <div className="space-y-2">
                                <Label htmlFor="strategy-name">Strategy Name</Label>
                                <Input 
                                    id="strategy-name"
                                    type="text"
                                    value={strategyName}
                                    onChange={e => setStrategyName(e.target.value)}
                                    placeholder="e.g., Nifty Bullish Spread"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            {legs.length > 1 && (
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="select-all-legs" />
                                    <Label htmlFor="select-all-legs" className="text-sm font-medium">Select All</Label>
                                </div>
                            )}
                            {legs.map(leg => (
                                <React.Fragment key={leg.id}>
                                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                    <Checkbox id={`leg-${leg.id}`} defaultChecked />
                                    <Badge variant={leg.action === 'Buy' ? 'default' : 'destructive'} className={cn("w-6 h-6 justify-center p-0", leg.action === 'Buy' ? 'bg-green-600' : 'bg-red-600')}>{leg.action.charAt(0)}</Badge>
                                    <div className="flex-grow text-sm">
                                        <span className="font-semibold">{leg.quantity}x {leg.instrumentName}</span> - <span>{formatCurrency(leg.ltp)}</span>
                                        <span className={cn("ml-2", leg.action === 'Buy' ? 'text-red-500' : 'text-green-500')}>
                                          ({formatCurrency((leg.action === 'Buy' ? -1 : 1) * leg.ltp * leg.quantity * lotSize)})
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingLegId(editingLegId === leg.id ? null : leg.id)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeLeg(leg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                </div>
                                {editingLegId === leg.id && (
                                    <EditLegForm 
                                        leg={leg}
                                        onUpdate={handleUpdateLeg}
                                        onCancel={() => setEditingLegId(null)}
                                    />
                                )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm pt-4 border-t">
                            <div className="flex justify-between"><span className="text-muted-foreground">Prob. of Profit</span> <span className="font-semibold">NA%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Max. Profit</span> <span className="font-semibold text-green-600">{formatCurrency(maxProfit)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Max. Loss</span> <span className="font-semibold text-red-600">{formatCurrency(maxLoss)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Max. RR Ratio</span> <span className="font-semibold">1:0.05</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Breakevens</span> <span className="font-semibold">57095.0</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Total PNL</span> <span className={cn("font-semibold", totalPnl >= 0 ? 'text-green-600' : 'text-red-600')}>{formatCurrency(totalPnl)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Net Credit</span> <span className="font-semibold">₹0</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Estimated Margin</span> <span className="font-semibold">{formatCurrency(estimatedMargin)}</span></div>
                        </div>

                        {/* Payoff Chart Section */}
                        <div className="pt-4 border-t">
                             <Tabs defaultValue="payoff" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="payoff"><PayoffIcon className="mr-2 h-4 w-4"/>Payoff Chart</TabsTrigger>
                                    <TabsTrigger value="greeks"><BookOpen className="mr-2 h-4 w-4"/>Greeks</TabsTrigger>
                                </TabsList>
                                <TabsContent value="payoff" className="mt-4">
                                    <ChartContainer config={{}} className="h-[300px] w-full">
                                        <Chart.ResponsiveContainer>
                                            <Chart.ComposedChart data={payoffData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <Chart.CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                <Chart.XAxis dataKey="price" name="Underlying Price" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`}/>
                                                <Chart.YAxis dataKey="pnl" name="Profit/Loss" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                                <Chart.Tooltip
                                                    contentStyle={{ 
                                                        backgroundColor: 'hsl(var(--background))', 
                                                        borderColor: 'hsl(var(--border))',
                                                        fontSize: '12px',
                                                    }}
                                                    labelFormatter={(value) => `Spot: ${formatCurrency(value)}`}
                                                    formatter={(value: number) => [formatCurrency(value), 'P&L']}
                                                />
                                                <Chart.ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeDasharray="3 3" />
                                                
                                                <defs>
                                                    <linearGradient id="splitColorPositive" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--positive))" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="hsl(var(--positive))" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                     <linearGradient id="splitColorNegative" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                                                    </linearGradient>
                                                </defs>
                                                
                                                <Chart.Area type="monotone" dataKey="pnl" stroke="transparent" fill="url(#splitColorPositive)" />
                                                <Chart.Area type="monotone" dataKey="pnl" stroke="transparent" fill="url(#splitColorNegative)" />

                                                <Chart.Line type="monotone" dataKey="pnl" strokeWidth={2} dot={false}
                                                    stroke="hsl(var(--primary))"
                                                />
                                            </Chart.ComposedChart>
                                        </Chart.ResponsiveContainer>
                                    </ChartContainer>
                                </TabsContent>
                                <TabsContent value="greeks" className="mt-4 text-center text-muted-foreground py-10">
                                     <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Leg</TableHead>
                                                <TableHead className="text-right">Delta</TableHead>
                                                <TableHead className="text-right">Gamma</TableHead>
                                                <TableHead className="text-right">Theta</TableHead>
                                                <TableHead className="text-right">Vega</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {legs.map(leg => {
                                                const multiplier = (leg.action === 'Buy' ? 1 : -1) * leg.quantity;
                                                return (
                                                    <TableRow key={leg.id}>
                                                        <TableCell className="text-left font-medium">{leg.quantity}x {leg.instrumentName}</TableCell>
                                                        <TableCell className="text-right">{(leg.delta * multiplier).toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">{(leg.gamma * multiplier).toFixed(4)}</TableCell>
                                                        <TableCell className="text-right">{(leg.theta * multiplier).toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">{(leg.vega * multiplier).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                        <TableBody>
                                          <TableRow className="border-t-2 border-primary/50 font-bold bg-muted/50">
                                                <TableCell className="text-left">Total</TableCell>
                                                <TableCell className="text-right">{totalGreeks.delta.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{totalGreeks.gamma.toFixed(4)}</TableCell>
                                                <TableCell className="text-right">{totalGreeks.theta.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{totalGreeks.vega.toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="pt-6">
                            <SwipeButton onConfirm={handleStrategyPlacement} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
