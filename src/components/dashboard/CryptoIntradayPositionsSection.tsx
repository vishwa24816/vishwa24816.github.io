"use client";

import { SubNav } from '@/components/dashboard/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { FiatHoldingsSection } from '@/components/dashboard/FiatHoldingsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { PackageOpen } from 'lucide-react';
import { IntradayPositionsSection } from '@/components/dashboard/IntradayPositionsSection';
import { FoPositionsSection } from '@/components/dashboard/FoPositionsSection';
import { FoBasketSection } from '@/components/dashboard/FoBasketSection';
import { FiatOptionChain } from '@/components/dashboard/FiatOptionChain';
import { CryptoOptionChain } from '@/components/dashboard/CryptoOptionChain';
import { ReadymadeStrategiesSection } from '@/components/dashboard/ReadymadeStrategiesSection';
import { StrategyBuilder } from '@/components/dashboard/StrategyBuilder';
import { MarketOverview } from './MarketOverview';


import React, { useState, useMemo, useEffect } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock, SelectedOptionLeg } from '@/types';
import { 
  mockPortfolioHoldings, 
  mockNewsArticles, 
  mockIntradayPositions,
  mockFoPositions,
  mockCryptoFutures, 
  mockCryptoAssets,
  mockStocks,
  mockIndexFuturesForWatchlist,
  mockStockFuturesForWatchlist,
  mockMutualFunds,
  mockBonds,
  mockCryptoFuturesForWatchlist,
  mockCryptoMutualFunds,
  mockCryptoETFs,
  mockWeb3AI,
  mockWeb3DeFi,
  mockWeb3Trending,
  mockWeb3Memes,
} from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';
import { mockWeb3NFTs } from '@/lib/mockData/web3NFTs';

// Helper functions
function getRelevantNewsForHoldings(holdings: PortfolioHolding[], allNews: NewsArticle[]): NewsArticle[] {
  if (!holdings.length || !allNews.length) {
    return [];
  }
  const relevantNews: NewsArticle[] = [];
  const holdingKeywords = holdings.flatMap(h => {
    const keywords = [h.name.toLowerCase()];
    if (h.symbol) {
      keywords.push(h.symbol.toLowerCase());
    }
    if (h.type === 'Mutual Fund' || h.type === 'Bond' || h.type === 'Crypto') {
        const nameParts = h.name.split(/[\s-]+/);
        keywords.push(...nameParts.map(part => part.toLowerCase()));
        if (h.symbol) { 
            const symbolParts = h.symbol.match(/[A-Z]+|[0-9.]+/g) || [];
            keywords.push(...symbolParts.map(part => part.toLowerCase()));
        }
    }
    return keywords;
  }).filter(Boolean).reduce((acc, keyword) => { 
    acc.add(keyword);
    return acc;
  }, new Set<string>());


  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(holdingKeywords).some(keyword => keyword && headlineLower.includes(keyword))) {
      relevantNews.push(news);
    }
  });
  return relevantNews;
}

function getRelevantNewsForPositions(
  intraday: IntradayPosition[],
  cryptoFutures: CryptoFuturePosition[],
  fo: FoPosition[] = [],
  allNews: NewsArticle[]
): NewsArticle[] {
  if ((!intraday.length && !cryptoFutures.length && !fo.length) || !allNews.length) {
    return [];
  }

  const positionKeywords = new Set<string>();

  intraday.forEach(p => {
    positionKeywords.add(p.name.toLowerCase());
    if (p.symbol) positionKeywords.add(p.symbol.toLowerCase());
  });
  
  fo.forEach(p => {
    const nameLower = p.instrumentName.toLowerCase();
    if (nameLower.includes("nifty")) positionKeywords.add("nifty");
    if (nameLower.includes("banknifty")) positionKeywords.add("banknifty");
    if (nameLower.includes("finnifty")) positionKeywords.add("finnifty");
    const parts = p.instrumentName.split(" ");
    if (parts.length > 0) positionKeywords.add(parts[0].toLowerCase());
  });

  cryptoFutures.forEach(p => {
    if (p.symbol.includes("USDT") || p.symbol.includes("INR")) { // Handle both USDT and INR pairs
      positionKeywords.add(p.symbol.replace(/USDT|INR/g, "").toLowerCase());
    } else {
      positionKeywords.add(p.symbol.toLowerCase());
    }
  });

  const relevantNews: NewsArticle[] = [];
  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(positionKeywords).some(keyword => keyword && headlineLower.includes(keyword))) {
      relevantNews.push(news);
    }
  });
  return relevantNews;
}

function getRelevantNewsForWatchlistItems(items: Stock[] | undefined, allNews: NewsArticle[]): NewsArticle[] {
  if (!items || !items.length || !allNews.length) {
    return [];
  }
  const relevantNews: NewsArticle[] = [];
  const itemKeywords = items.flatMap(item => {
    const keywords = [item.name.toLowerCase()];
    if ('symbol' in item && item.symbol) { 
      keywords.push(item.symbol.toLowerCase());
    }
    
    // Improved keyword extraction for complex financial instruments
    const nameParts = item.name.split(/[\s-]+/); 
    keywords.push(...nameParts.map(part => part.toLowerCase()));
    if ('symbol' in item && item.symbol) { 
        const symbolParts = item.symbol.match(/[A-Z]+|[0-9.]+/g) || [];
        keywords.push(...symbolParts.map(part => part.toLowerCase()));
    }

    return keywords;
  }).filter(Boolean).reduce((acc, keyword) => {
    acc.add(keyword);
    return acc;
  }, new Set<string>());


  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(itemKeywords).some(keyword => keyword && headlineLower.includes(keyword))) {
      relevantNews.push(news);
    }
  });
  return relevantNews;
}

interface DemoDashboardProps {
  activeMode: 'Portfolio' | 'Fiat' | 'Crypto' | 'Web3';
}

export function DemoDashboard({ activeMode }: DemoDashboardProps) {
    const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
    if (activeMode === 'Portfolio') {
        return {
            primaryNavItems: ["Fiat", "Crypto", "Web3", "Pledged Holdings"],
            secondaryNavTriggerCategories: {
                Fiat: ["Holdings", "Positions", "Portfolio Watchlist"],
                Crypto: ["Holdings", "Positions", "Portfolio Watchlist"],
                Web3: ["Holdings", "Portfolio Watchlist"],
                "Pledged Holdings": ["Fiat", "Crypto", "Web3"],
            }
        }
    }
    if (activeMode === 'Fiat') {
        const watchlistNav = ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)];
        return {
            primaryNavItems: ["Indian Stocks", "US Stocks", "Futures", "Options", "Mutual Fund", "Bonds", "IPO"],
            secondaryNavTriggerCategories: {
                "Indian Stocks": watchlistNav,
                "US Stocks": watchlistNav,
                "Futures": ["Index Futures", "Stock Futures"],
                "Options": ["Custom", "Readymade"],
                "Mutual Fund": watchlistNav,
                "Bonds": watchlistNav,
                "IPO": [],
            }
        };
    }
     if (activeMode === 'Web3') {
        return {
            primaryNavItems: ["Trending", "AI", "DeFi", "Memes", "NFT"],
            secondaryNavTriggerCategories: {
                Trending: [],
                AI: [],
                DeFi: [],
                Memes: [],
                NFT: [],
            }
        };
    }
    
    // Crypto mode
    const cryptoPrimaryNav = [
      "Spot", "Futures", "Options", "Mutual Fund"
    ];
    const cryptoSecondaryNav: Record<string, string[]> = {
      "Spot": ["Top watchlist"],
      "Futures": ["Top watchlist"],
      "Options": ["Custom", "Readymade"],
      "Mutual Fund": ["Top watchlist"],
    };
    return { primaryNavItems: cryptoPrimaryNav, secondaryNavTriggerCategories: cryptoSecondaryNav };
  }, [activeMode]);


  const [activePrimaryItem, setActivePrimaryItem] = useState(primaryNavItems[0]);
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories[primaryNavItems[0]]?.[0] || ""
  );
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00);
  const [cryptoCashBalance, setCryptoCashBalance] = useState(15000.00);
  const [strategyLegs, setStrategyLegs] = useState<SelectedOptionLeg[]>([]);


  useEffect(() => {
    const firstPrimary = primaryNavItems[0] || "";
    setActivePrimaryItem(firstPrimary);
    const newSecondaryItems = secondaryNavTriggerCategories[firstPrimary] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || '');
  }, [activeMode, primaryNavItems, secondaryNavTriggerCategories]);
  
   useEffect(() => {
    if (activeMode === 'Fiat') {
        const themeMapping: { [key: string]: string } = {
            'Indian Stocks': 'orange',
            'US Stocks': 'brown',
            'Futures': 'caramel',
            'Options': 'yellow',
            'Mutual Fund': 'pink',
            'Bonds': 'maroon',
            'IPO': 'red'
        };
        const theme = themeMapping[activePrimaryItem] || 'fiat'; // fallback to a generic fiat theme
        document.documentElement.setAttribute('data-theme', theme);
    } else {
        document.documentElement.setAttribute('data-theme', activeMode.toLowerCase());
    }
  }, [activeMode, activePrimaryItem]);


  const handlePrimaryNavClick = (item: string) => {
    setActivePrimaryItem(item);
    const newSecondaryItems = secondaryNavTriggerCategories[item] || [];
    if (newSecondaryItems.length > 0) {
      setActiveSecondaryItem(newSecondaryItems[0]);
    } else {
      setActiveSecondaryItem(""); 
    }
  };

  const handleSecondaryNavClick = (item: string) => {
    setActiveSecondaryItem(item);
  };
  
  const fiatHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type !== 'Crypto'), []);
  const cryptoHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type === 'Crypto'), []);

  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (activeMode === 'Portfolio') {
      const isHoldingsView = activeSecondaryItem === "Holdings";
      const isPositionsView = activeSecondaryItem === "Positions";
      const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

      if (activePrimaryItem === 'Fiat') {
          if (isHoldingsView) newsForView = getRelevantNewsForHoldings(fiatHoldings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions(mockIntradayPositions, [], mockFoPositions, mockNewsArticles);
          if (isWatchlistView) {
            itemsForWatchlist = mockStocks.slice(0, 5);
            newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      } else if (activePrimaryItem === 'Crypto') {
          if (isHoldingsView) newsForView = getRelevantNewsForHoldings(cryptoHoldings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions([], mockCryptoFutures, [], mockNewsArticles);
          if (isWatchlistView) {
              itemsForWatchlist = mockCryptoAssets.slice(0, 5);
              newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      }
  } else if (activeMode === 'Fiat') {
    const isIndianStockView = activePrimaryItem === "Indian Stocks";
    const isUsStockView = activePrimaryItem === "US Stocks";
    const isTopWatchlistView = (isIndianStockView || isUsStockView || ["Mutual Fund", "Bonds"].includes(activePrimaryItem)) && activeSecondaryItem.startsWith("Top watchlist");
    const isCategoryNumberedWatchlistView = (isIndianStockView || isUsStockView || ["Mutual Fund", "Bonds"].includes(activePrimaryItem)) && !!activeSecondaryItem.match(/^Watchlist \d+$/);

    if (activePrimaryItem === 'Futures') {
        categoryWatchlistTitle = `${activeSecondaryItem} Watchlist`;
        if (activeSecondaryItem === 'Index Futures') {
            itemsForWatchlist = mockIndexFuturesForWatchlist;
        } else if (activeSecondaryItem === 'Stock Futures') {
            itemsForWatchlist = mockStockFuturesForWatchlist;
        }
        newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else if (isTopWatchlistView || isCategoryNumberedWatchlistView) {
        categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
        if (isTopWatchlistView) {
            if (isIndianStockView) itemsForWatchlist = mockStocks;
            else if (isUsStockView) itemsForWatchlist = mockUsStocks;
            else if (activePrimaryItem === "Mutual Fund") itemsForWatchlist = mockMutualFunds;
            else if (activePrimaryItem === "Bonds") itemsForWatchlist = mockBonds;
            newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
        } else {
            itemsForWatchlist = [];
            newsForView = mockNewsArticles;
        }
    } else {
      newsForView = mockNewsArticles;
    }
  } else if (activeMode === 'Crypto') {
    if (activePrimaryItem !== "Options") {
      categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
      if (activePrimaryItem === "Spot") itemsForWatchlist = mockCryptoAssets;
      else if (activePrimaryItem === "Futures") itemsForWatchlist = mockCryptoFuturesForWatchlist;
      else if (activePrimaryItem === "Mutual Fund") itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
      else itemsForWatchlist = [];
      newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else {
      newsForView = mockNewsArticles;
    }
  } else if (activeMode === 'Web3') {
      newsForView = mockNewsArticles;
  }
  
  const renderPortfolioContent = () => {
    const isHoldingsView = activeSecondaryItem === "Holdings";
    const isPositionsView = activeSecondaryItem === "Positions";
    const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

    switch (activePrimaryItem) {
        case 'Fiat':
            if (isHoldingsView) return <><FiatHoldingsSection intradayPositions={mockIntradayPositions} foPositions={mockFoPositions} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} cryptoCashBalance={cryptoCashBalance} setCryptoCashBalance={setCryptoCashBalance} /><NewsSection articles={newsForView} /></>;
            if (isPositionsView) return <div className="space-y-8"><IntradayPositionsSection /><FoPositionsSection /><FoBasketSection /><NewsSection articles={newsForView} /></div>;
            if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Fiat Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride="simFiatWatchlist"/><NewsSection articles={newsForView} /></div>;
            return null;
        case 'Crypto':
            if (isHoldingsView) return <><CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={cryptoHoldings} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} /><NewsSection articles={newsForView} /></>;
            if (isPositionsView) return <div className="space-y-8"><CryptoFuturesSection positions={mockCryptoFutures} cashBalance={cryptoCashBalance} /><NewsSection articles={newsForView} /></div>;
            if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist'}/><NewsSection articles={newsForView} /></div>;
            return null;
        case 'Web3':
             if (isHoldingsView) return <><CryptoHoldingsSection title="Web3 Wallet & Holdings" holdings={mockPortfolioHoldings.filter(h => h.type === 'Crypto')} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} /><NewsSection articles={newsForView} /></>;
             if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Web3 Watchlist" localStorageKeyOverride={'simWeb3Watchlist'}/><NewsSection articles={newsForView} /></div>;
            return null;
        case 'Pledged Holdings':
            const pledgedFiatHoldings = fiatHoldings.slice(0, 2); // Mock: first 2 fiat holdings are pledged
            const pledgedCryptoHoldings = cryptoHoldings.slice(0, 1); // Mock: first crypto holding is pledged
            if (activeSecondaryItem === 'Fiat') return <FiatHoldingsSection intradayPositions={[]} foPositions={[]} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={() => {}} cryptoCashBalance={0} setCryptoCashBalance={() => {}} />;
            if (activeSecondaryItem === 'Crypto') return <CryptoHoldingsSection title="Pledged Crypto Holdings" holdings={pledgedCryptoHoldings} cashBalance={0} setCashBalance={() => {}} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={() => {}} isRealMode={false} />;
            if (activeSecondaryItem === 'Web3') return <div className="text-center py-10 text-muted-foreground"><p>No Pledged Web3 Holdings.</p></div>;
            return null;
        default: return null;
    }
  };

  const renderMarketContent = () => {
    if (activeMode === 'Fiat') {
        if (activePrimaryItem === "Options") { 
            return activeSecondaryItem === "Custom" ? ( <div className="space-y-8"><FiatOptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div>) 
            : activeSecondaryItem === "Readymade" ? ( <div className="space-y-8"><ReadymadeStrategiesSection onStrategySelect={(legs) => setStrategyLegs(legs)} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div> ) 
            : null
        }
        if (activePrimaryItem === "IPO") {
            return <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground"><PackageOpen className="h-16 w-16 mb-4" /><h2 className="text-2xl font-semibold mb-2 text-foreground">IPO Section</h2><p className="max-w-md">Information about upcoming and recent Initial Public Offerings will be displayed here.</p></div>
        }
        if (activePrimaryItem === "Futures") {
            return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} /><NewsSection articles={newsForView} /></div>
        }
        
        const isIndianStockView = activePrimaryItem === "Indian Stocks";
        const isUsStockView = activePrimaryItem === "US Stocks";
        const isTopWatchlistView = (isIndianStockView || isUsStockView || ["Mutual Fund", "Bonds"].includes(activePrimaryItem)) && activeSecondaryItem.startsWith("Top watchlist");
        const isCategoryNumberedWatchlistView = (isIndianStockView || isUsStockView || ["Mutual Fund", "Bonds"].includes(activePrimaryItem)) && !!activeSecondaryItem.match(/^Watchlist \d+$/);
        
        if(isTopWatchlistView) return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} /><NewsSection articles={newsForView} /></div>
        if(isCategoryNumberedWatchlistView) return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Fiat_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]}/><NewsSection articles={newsForView} /></div>
    
    } else if (activeMode === 'Crypto') {
        if (activePrimaryItem === "Options") {
            return activeSecondaryItem === "Custom" ? ( <div className="space-y-8"><CryptoOptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div>) 
            : activeSecondaryItem === "Readymade" ? ( <div className="space-y-8"><ReadymadeStrategiesSection onStrategySelect={(legs) => setStrategyLegs(legs)} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div> ) 
            : null
        }
        return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true}/><NewsSection articles={newsForView} /></div>
    } else if (activeMode === 'Web3') {
        let web3Items: Stock[] = [];
        let watchlistTitle = activePrimaryItem;
        switch (activePrimaryItem) {
            case 'Trending':
                web3Items = mockWeb3Trending;
                watchlistTitle = "Trending Web3 Tokens";
                break;
            case 'AI':
                web3Items = mockWeb3AI;
                watchlistTitle = "Top AI Tokens";
                break;
            case 'DeFi':
                web3Items = mockWeb3DeFi;
                watchlistTitle = "Top DeFi Tokens";
                break;
            case 'Memes':
                web3Items = mockWeb3Memes;
                watchlistTitle = "Top Meme Tokens";
                break;
             case 'NFT':
                web3Items = mockWeb3NFTs;
                watchlistTitle = "Top NFT Collections";
                break;
        }
        newsForView = getRelevantNewsForWatchlistItems(web3Items, mockNewsArticles);
        return (
            <div className="space-y-8">
                <WatchlistSection 
                    title={watchlistTitle} 
                    displayItems={web3Items} 
                    isPredefinedList={true} 
                />
                <NewsSection articles={newsForView} />
            </div>
        );
    }
    
    return <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground"><PackageOpen className="h-16 w-16 mb-4" /><h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome!</h2><p className="max-w-md">Select a category above to view your assets and portfolio.</p></div>;
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8">
      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={handleSecondaryNavClick}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
      />
      
      {activeMode === 'Portfolio' ? renderPortfolioContent() : renderMarketContent()}

    </main>
  );
}