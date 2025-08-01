
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockMutualFunds: Stock[] = [
  // Large Cap
  { 
    id: 'mf_lc_1', 
    symbol: 'AXISBLUECHIP', 
    name: 'Axis Bluechip Fund Direct-Growth', 
    price: 52.30, 
    change: -0.05, 
    changePercent: -0.10, 
    exchange: 'MF', 
    sector: 'Large Cap',
    riskLevel: 'High',
    category: 'Equity',
    annualisedReturn: 15.2,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 500,
    fundSize: '₹31,521 Cr',
    aboutCompany: 'A large-cap equity fund that aims to generate long-term capital appreciation by investing in a diversified portfolio of predominantly large-cap stocks.'
  },
  { id: 'mf_lc_2', symbol: 'MIRAEALC', name: 'Mirae Asset Large Cap Fund Direct-Growth', price: 90.10, change: 0.50, changePercent: 0.56, exchange: 'MF', sector: 'Large Cap', riskLevel: 'High' },
  { id: 'mf_lc_3', symbol: 'CANRALC', name: 'Canara Robeco Bluechip Equity Fund Direct-Growth', price: 45.50, change: 0.20, changePercent: 0.44, exchange: 'MF', sector: 'Large Cap', riskLevel: 'High' },
  { id: 'mf_lc_4', symbol: 'EDELWEISSLG', name: 'Edelweiss Large Cap Fund Direct-Growth', price: 65.20, change: -0.10, changePercent: -0.15, exchange: 'MF', sector: 'Large Cap', riskLevel: 'High' },
  { id: 'mf_lc_5', symbol: 'ICICIBLUE', name: 'ICICI Prudential Bluechip Fund Direct-Growth', price: 80.75, change: 0.45, changePercent: 0.56, exchange: 'MF', sector: 'Large Cap', riskLevel: 'High' },
  
  // Mid Cap
  {
    id: 'mf_mc_1',
    symbol: 'KOTAKEMEQ',
    name: 'Kotak Emerging Equity Fund Direct-Growth',
    price: 95.50,
    change: 0.80,
    changePercent: 0.84,
    exchange: 'MF',
    sector: 'Mid Cap',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 23.1,
    navDate: '20-Jun-2025',
    rating: '5',
    minSipAmount: 100,
    fundSize: '₹34,100 Cr',
    aboutCompany: 'An open-ended equity scheme predominantly investing in mid-cap stocks, aiming for long-term capital growth.'
  },
  {
    id: 'mf_mc_2',
    symbol: 'HDFCMIDCAP',
    name: 'HDFC Mid-Cap Opportunities Fund Direct-Growth',
    price: 120.70,
    change: 1.50,
    changePercent: 1.26,
    exchange: 'MF',
    sector: 'Mid Cap',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 24.2,
    navDate: '20-Jun-2025',
    rating: '5',
    minSipAmount: 100,
    fundSize: '₹45,600 Cr',
    aboutCompany: 'One of the largest mid-cap funds, it invests in a diversified portfolio of mid-sized companies with high growth potential.'
  },
  { id: 'mf_mc_3', symbol: 'PGIMMID', name: 'PGIM India Midcap Opportunities Fund Direct-Growth', price: 50.80, change: 0.90, changePercent: 1.80, exchange: 'MF', sector: 'Mid Cap', riskLevel: 'Very High' },
  { id: 'mf_mc_4', symbol: 'SBIMAGMID', name: 'SBI Magnum Midcap Fund Direct-Growth', price: 180.20, change: 2.10, changePercent: 1.18, exchange: 'MF', sector: 'Mid Cap', riskLevel: 'Very High' },
  { id: 'mf_mc_5', symbol: 'MOTILALMID', name: 'Motilal Oswal Midcap Fund Direct-Growth', price: 70.40, change: 1.20, changePercent: 1.73, exchange: 'MF', sector: 'Mid Cap', riskLevel: 'Very High' },

  // Small Cap
  { 
    id: 'mf_sc_1', 
    symbol: 'SBISMCAP', 
    name: 'SBI Small Cap Fund Direct-Growth', 
    price: 130.25, 
    change: 1.10, 
    changePercent: 0.85, 
    exchange: 'MF', 
    sector: 'Small Cap',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 25.8,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 500,
    fundSize: '₹18,344 Cr'
  },
  {
    id: 'mf_sc_2',
    symbol: 'NIPPONIND',
    name: 'Nippon India Small Cap Fund Direct-Growth',
    price: 115.40,
    change: 2.10,
    changePercent: 1.85,
    exchange: 'MF',
    sector: 'Small Cap',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 27.9,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 100,
    fundSize: '₹37,800 Cr',
    aboutCompany: 'A small-cap fund focusing on identifying and investing in small-cap companies with the potential to become future market leaders.'
  },
  { id: 'mf_sc_3', symbol: 'AXISSMALL', name: 'Axis Small Cap Fund Direct-Growth', price: 75.60, change: 1.50, changePercent: 2.02, exchange: 'MF', sector: 'Small Cap', riskLevel: 'Very High' },
  { id: 'mf_sc_4', symbol: 'QUANTSMALL', name: 'Quant Small Cap Fund Direct-Growth', price: 230.10, change: 4.50, changePercent: 1.99, exchange: 'MF', sector: 'Small Cap', riskLevel: 'Very High' },
  { id: 'mf_sc_5', symbol: 'HDFCSMALL', name: 'HDFC Small Cap Fund Direct-Growth', price: 105.80, change: 1.90, changePercent: 1.83, exchange: 'MF', sector: 'Small Cap', riskLevel: 'Very High' },

  // Sectoral
  {
    id: 'mf_sec_1',
    symbol: 'ICICITECH',
    name: 'ICICI Prudential Technology Fund Direct-Growth',
    price: 155.00,
    change: -1.20,
    changePercent: -0.77,
    exchange: 'MF',
    sector: 'Sectoral',
    riskLevel: 'Very High',
    category: 'Technology',
    annualisedReturn: 28.5,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 100,
    fundSize: '₹8,500 Cr',
    aboutCompany: 'A sectoral fund investing in technology and tech-enabled companies in India, aiming to capitalize on the digital transformation trend.'
  },
  { id: 'mf_sec_2', symbol: 'TATASTEELSEC', name: 'Tata Steel Sectoral Fund Direct-Growth', price: 25.30, change: 0.50, changePercent: 2.02, exchange: 'MF', sector: 'Sectoral', riskLevel: 'Very High' },
  { id: 'mf_sec_3', symbol: 'ADITYABSLPHARMA', name: 'Aditya Birla SL Pharma & Healthcare Fund Direct-Growth', price: 40.10, change: -0.20, changePercent: -0.50, exchange: 'MF', sector: 'Sectoral', riskLevel: 'Very High' },
  { id: 'mf_sec_4', symbol: 'UTIBANKING', name: 'UTI Banking and Financial Services Fund Direct-Growth', price: 55.60, change: 0.70, changePercent: 1.27, exchange: 'MF', sector: 'Sectoral', riskLevel: 'Very High' },
  { id: 'mf_sec_5', symbol: 'ICICICONSUMER', name: 'ICICI Prudential FMCG Fund Direct-Growth', price: 48.90, change: 0.30, changePercent: 0.62, exchange: 'MF', sector: 'Sectoral', riskLevel: 'Very High' },

  // Thematic
  { id: 'mf_thm_1', symbol: 'TATAINFRA', name: 'Tata Infrastructure Fund Direct-Growth', price: 140.50, change: 1.20, changePercent: 0.86, exchange: 'MF', sector: 'Thematic', riskLevel: 'Very High' },
  { id: 'mf_thm_2', symbol: 'ICICIMNC', name: 'ICICI Prudential MNC Fund Direct-Growth', price: 450.70, change: 3.50, changePercent: 0.78, exchange: 'MF', sector: 'Thematic', riskLevel: 'Very High' },
  { id: 'mf_thm_3', symbol: 'IDFCINFRA', name: 'IDFC Infrastructure Fund Direct-Growth', price: 30.20, change: -0.10, changePercent: -0.33, exchange: 'MF', sector: 'Thematic', riskLevel: 'Very High' },
  { id: 'mf_thm_4', symbol: 'TATAETHICAL', name: 'Tata Ethical Fund Direct-Growth', price: 320.50, change: 2.80, changePercent: 0.88, exchange: 'MF', sector: 'Thematic', riskLevel: 'High' },
  { id: 'mf_thm_5', symbol: 'ICICIESG', name: 'ICICI Prudential ESG Fund Direct-Growth', price: 22.80, change: 0.15, changePercent: 0.66, exchange: 'MF', sector: 'Thematic', riskLevel: 'High' },

  // Debt
  {
    id: 'mf_dbt_1',
    symbol: 'IDFCGOVSEC',
    name: 'IDFC Gilt 2027 Index Fund Direct-Growth',
    price: 15.50,
    change: 0.02,
    changePercent: 0.13,
    exchange: 'MF',
    sector: 'Debt',
    riskLevel: 'Moderate',
    category: 'Gilt',
    annualisedReturn: 7.2,
    navDate: '20-Jun-2025',
    rating: 'NA',
    minSipAmount: 1000,
    fundSize: '₹5,200 Cr'
  },
  { id: 'mf_dbt_2', symbol: 'KOTAKBOND', name: 'Kotak Bond Direct-Growth', price: 45.30, change: 0.05, changePercent: 0.11, exchange: 'MF', sector: 'Debt', riskLevel: 'Moderate' },
  { id: 'mf_dbt_3', symbol: 'HDFCCREDIT', name: 'HDFC Credit Risk Debt Fund Direct-Growth', price: 12.80, change: 0.01, changePercent: 0.08, exchange: 'MF', sector: 'Debt', riskLevel: 'Moderately High' },
  { id: 'mf_dbt_4', symbol: 'ICICILIQUID', name: 'ICICI Prudential Liquid Fund Direct-Growth', price: 300.00, change: 0.01, changePercent: 0.00, exchange: 'MF', sector: 'Debt', riskLevel: 'Low' },
  { id: 'mf_dbt_5', symbol: 'NIPPONLIQ', name: 'Nippon India Liquid Fund Direct-Growth', price: 4500.00, change: 0.05, changePercent: 0.00, exchange: 'MF', sector: 'Debt', riskLevel: 'Low' },
  
  // Flexi Cap
  { 
    id: 'mf_flx_1', 
    symbol: 'PARAGPARIKH', 
    name: 'Parag Parikh Flexi Cap Fund Direct-Growth', 
    price: 65.78, 
    change: 0.15, 
    changePercent: 0.23, 
    exchange: 'MF', 
    sector: 'Flexi Cap', 
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 21.5,
    navDate: '20-Jun-2025',
    rating: '5',
    minSipAmount: 1000,
    fundSize: '₹66,422 Cr',
    holdingsCount: 40,
    aboutCompany: 'An open-ended dynamic equity scheme investing across large cap, mid cap, small cap stocks. The fund also invests in foreign equities to provide geographical diversification.',
    topHoldings: [
        { name: 'HDFC Bank Ltd.', percentage: 7.50 },
        { name: 'ITC Ltd.', percentage: 6.80 },
        { name: 'Alphabet Inc.', percentage: 6.50 },
        { name: 'Axis Bank Ltd.', percentage: 5.40 },
        { name: 'Microsoft Corporation', percentage: 5.10 },
    ],
    marketTrends: {
        shortTerm: 'Positive',
        longTerm: 'Positive',
        analystRating: '4.8/5'
    },
    pros: [
        'Diversified across domestic and international stocks.',
        'Consistent long-term performance track record.',
        'Experienced fund management team.'
    ],
    cons: [
        'High exposure to foreign equities can be volatile due to currency fluctuations.',
        'Expense ratio is slightly higher than peers.'
    ],
    fundManagement: {
      managerName: 'Rajeev Thakkar',
      managerBio: 'Rajeev Thakkar has over 20 years of experience in various areas of capital markets such as investment banking, corporate finance, and securities broking. He has been instrumental in steering the fund house with his sharp investment acumen.',
      managerAvatarUrl: 'https://placehold.co/100x100.png?text=RT',
      fundHouse: 'PPFAS Mutual Fund'
    }
  },
  { id: 'mf_flx_2', symbol: 'PGIMFLEXI', name: 'PGIM India Flexi Cap Fund Direct-Growth', price: 60.20, change: 0.80, changePercent: 1.35, exchange: 'MF', sector: 'Flexi Cap', riskLevel: 'Very High' },
  { id: 'mf_flx_3', symbol: 'CANRAFLEXI', name: 'Canara Robeco Flexi Cap Fund Direct-Growth', price: 280.50, change: 3.10, changePercent: 1.12, exchange: 'MF', sector: 'Flexi Cap', riskLevel: 'Very High' },
  { id: 'mf_flx_4', symbol: 'UTIFLEXI', name: 'UTI Flexi Cap Fund Direct-Growth', price: 260.90, change: 2.50, changePercent: 0.97, exchange: 'MF', sector: 'Flexi Cap', riskLevel: 'Very High' },
  { id: 'mf_flx_5', symbol: 'HDFCFLEXI', name: 'HDFC Flexi Cap Fund Direct-Growth', price: 1050.00, change: 12.00, changePercent: 1.15, exchange: 'MF', sector: 'Flexi Cap', riskLevel: 'Very High' },

  // Index Fund
  { 
    id: 'mf_idx_1', 
    symbol: 'UTINIFTY50', 
    name: 'UTI Nifty 50 Index Fund Direct-Growth', 
    price: 140.50, 
    change: 0.30, 
    changePercent: 0.21, 
    exchange: 'MF', 
    sector: 'Index Fund',
    riskLevel: 'High',
    category: 'Equity',
    annualisedReturn: 14.5,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 500,
    fundSize: '₹10,567 Cr'
  },
  { id: 'mf_idx_2', symbol: 'HDFCSENSEX', name: 'HDFC Index Fund-S&P BSE Sensex Direct Plan-Growth', price: 613.50, change: 2.50, changePercent: 0.41, exchange: 'MF', sector: 'Index Fund', riskLevel: 'High' },
  { id: 'mf_idx_3', symbol: 'ICICINIFTY', name: 'ICICI Prudential Nifty 50 Index Fund Direct-Growth', price: 182.50, change: 0.75, changePercent: 0.41, exchange: 'MF', sector: 'Index Fund', riskLevel: 'High' },
  { id: 'mf_idx_4', symbol: 'MOTILALN100', name: 'Motilal Oswal Nasdaq 100 ETF', price: 145.20, change: 1.80, changePercent: 1.25, exchange: 'MF', sector: 'Index Fund', riskLevel: 'Very High' },
  { id: 'mf_idx_5', symbol: 'NAVIUSIDX', name: 'Navi US Total Stock Market Fund of Fund Direct-Growth', price: 12.50, change: 0.10, changePercent: 0.81, exchange: 'MF', sector: 'Index Fund', riskLevel: 'Very High' },

  // Multi Cap
  { id: 'mf_multi_1', symbol: 'QUANTMULTI', name: 'Quant Active Fund Direct-Growth', price: 580.40, change: 7.10, changePercent: 1.24, exchange: 'MF', sector: 'Multi Cap', riskLevel: 'Very High' },
  { id: 'mf_multi_2', symbol: 'NIPPONMULTI', name: 'Nippon India Multi Cap Fund Direct-Growth', price: 210.80, change: 2.50, changePercent: 1.20, exchange: 'MF', sector: 'Multi Cap', riskLevel: 'Very High' },
  { id: 'mf_multi_3', symbol: 'ICICIMULTI', name: 'ICICI Prudential Multicap Fund Direct-Growth', price: 55.60, change: 0.60, changePercent: 1.09, exchange: 'MF', sector: 'Multi Cap', riskLevel: 'Very High' },
  { id: 'mf_multi_4', symbol: 'HDFCMULTI', name: 'HDFC Multi-Cap Fund Direct-Growth', price: 35.10, change: 0.40, changePercent: 1.15, exchange: 'MF', sector: 'Multi Cap', riskLevel: 'Very High' },
  { id: 'mf_multi_5', symbol: 'KOTAKMULTI', name: 'Kotak Multicap Fund Direct-Growth', price: 42.70, change: 0.55, changePercent: 1.30, exchange: 'MF', sector: 'Multi Cap', riskLevel: 'Very High' },

  // ELSS
  {
    id: 'mf_elss_1',
    symbol: 'MIRAEELSS',
    name: 'Mirae Asset ELSS Tax Saver Fund Direct-Growth',
    price: 35.12,
    change: 0.20,
    changePercent: 0.57,
    exchange: 'MF',
    sector: 'ELSS',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 18.9,
    navDate: '20-Jun-2025',
    rating: '5',
    minSipAmount: 500,
    fundSize: '₹14,334 Cr'
  },
  { id: 'mf_elss_2', symbol: 'QUANTSAVER', name: 'Quant Tax Plan Direct-Growth', price: 350.70, change: 5.20, changePercent: 1.50, exchange: 'MF', sector: 'ELSS', riskLevel: 'Very High' },
  { id: 'mf_elss_3', symbol: 'IDFCELSS', name: 'IDFC Tax Advantage (ELSS) Fund Direct-Growth', price: 90.45, change: 1.10, changePercent: 1.23, exchange: 'MF', sector: 'ELSS', riskLevel: 'Very High' },
  { id: 'mf_elss_4', symbol: 'DSPELSS', name: 'DSP Tax Saver Fund Direct-Growth', price: 85.60, change: 0.90, changePercent: 1.06, exchange: 'MF', sector: 'ELSS', riskLevel: 'Very High' },
  { id: 'mf_elss_5', symbol: 'ICICIELSS', name: 'ICICI Prudential Long Term Equity Fund (Tax Saving) Direct-Growth', price: 720.30, change: 8.50, changePercent: 1.19, exchange: 'MF', sector: 'ELSS', riskLevel: 'Very High' },
];
