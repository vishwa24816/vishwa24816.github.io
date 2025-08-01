
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { mockFoPositions } from '@/lib/mockData';
import type { FoPosition } from '@/types';
import { cn } from '@/lib/utils';
import { Layers, XCircle, Settings2, ChevronDown, List, BarChart2, LayoutGrid, PieChart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';

type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';

const PositionRow = ({ position, onAdjust, onExit }: { position: FoPosition, onAdjust: () => void, onExit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const isPnlPositive = position.pAndL >= 0;
    const isMtmPositive = position.mtmPnl >= 0;
    const totalQuantity = position.lots * position.quantityPerLot;

    return (
        <div className="border-b transition-all duration-300">
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{position.instrumentName}</p>
                    <p className={cn("text-xs font-medium", position.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600')}>{position.transactionType} ({position.optionType})</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                    <p className={cn("text-sm font-medium", isPnlPositive ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(position.pAndL)}
                    </p>
                    <p className={cn("text-xs", isMtmPositive ? 'text-green-500' : 'text-red-500')}>MTM: {formatCurrency(position.mtmPnl)}</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div><p className="text-muted-foreground">Quantity</p><p className="font-medium text-foreground">{totalQuantity.toLocaleString()} ({position.lots} lots)</p></div>
                        <div className="text-right"><p className="text-muted-foreground">Avg. Price</p><p className="font-medium text-foreground">{formatCurrency(position.avgPrice)}</p></div>
                        <div><p className="text-muted-foreground">LTP</p><p className="font-medium text-foreground">{formatCurrency(position.ltp)}</p></div>
                        <div className="text-right"><p className="text-muted-foreground">P&L %</p><p className={cn("font-medium", isPnlPositive ? 'text-green-600' : 'text-red-600')}>{position.pAndLPercent.toFixed(2)}%</p></div>
                        <div><p className="text-muted-foreground">Expiry</p><p className="font-medium text-foreground">{new Date(position.expiryDate).toLocaleDateString()}</p></div>
                    </div>
                    <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={onAdjust}><Settings2 className="mr-2 h-4 w-4" /> Adjust</Button>
                        <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={onExit}><XCircle className="mr-2 h-4 w-4" /> Exit</Button>
                    </div>
                </div>
            )}
        </div>
    );
};


export function FoPositionsSection({ onAssetClick }: { onAssetClick: (asset: Stock) => void }) {
  const positions = mockFoPositions;
  const router = useRouter();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleAdjustPosition = (pos: FoPosition) => {
    let path = '';
    if (pos.optionType === 'FUT') {
        path = `/order/future/${encodeURIComponent(pos.instrumentName)}`;
    } else if (pos.optionType === 'CE' || pos.optionType === 'PE') {
        path = `/order/option/${encodeURIComponent(pos.instrumentName)}`;
    }
    if (path) {
        onAssetClick({ id: pos.id, symbol: pos.instrumentName, name: pos.instrumentName, price: pos.ltp, change: 0, changePercent: 0 });
    }
  };

  const handleExitPosition = (pos: FoPosition) => {
    toast({
      title: `Exiting Position (Mock): ${pos.instrumentName}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);
  const totalMtmPnl = positions.reduce((acc, pos) => acc + pos.mtmPnl, 0);

  const chartData = useMemo(() => {
    return positions.map(pos => ({
      name: pos.instrumentName,
      value: pos.avgPrice * pos.lots * pos.quantityPerLot,
      fill: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`,
      label: pos.pAndL >= 0 ? 'Profit' : 'Loss'
    }));
  }, [positions]);

  const chartConfig = {
      value: {
        label: 'Invested Value',
      },
      ...positions.reduce((acc, pos) => {
        acc[pos.instrumentName] = {
            label: pos.instrumentName,
            color: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`
        };
        return acc;
    }, {} as any)
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return positions.map(pos => ({
      name: pos.instrumentName,
      value: pos.avgPrice * pos.lots * pos.quantityPerLot,
      pnl: pos.pAndL,
      pnlPercent: pos.pAndLPercent,
    }));
  }, [positions]);

  const renderContent = () => {
    if (positions.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8 px-6">You have no open F&O positions.</p>
      );
    }
    switch(viewMode) {
      case 'list':
        return positions.map((pos) => (
          <PositionRow 
            key={pos.id} 
            position={pos}
            onAdjust={() => handleAdjustPosition(pos)}
            onExit={() => handleExitPosition(pos)}
          />
        ));
      case 'bar':
        return (
          <div className="w-full h-[300px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.ResponsiveContainer>
                <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} tickLine={false} axisLine={false} />
                  <Chart.Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))'
                    }}
                    formatter={(value) => `Value: ${formatCurrency(value as number)}`}
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

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
            <Layers className="h-6 w-6 mr-2" /> F&O Positions
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
        <div className="px-6 py-4 border-b">
           <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">MTM P&L</p>
              <p className={cn("text-lg font-semibold", totalMtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalMtmPnl)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall P&L</p>
              <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalPandL)}
              </p>
            </div>
          </div>
        </div>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
