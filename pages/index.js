import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Eye, Globe } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    total: 487010,
    savings: 7000,
    core: 105356,
    growth: 96319, 
    crypto: 101000,
    hedge: 170050,
    currency: 'SGD'
  });

  const [showEdit, setShowEdit] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('SGD');
  const [exchangeRates, setExchangeRates] = useState({
    SGD: 1,
    USD: 0.74,
    INR: 61.5
  });

  // Currency formatting with thousand separators
  const formatCurrency = (num, currency = data.currency) => {
    if (!num || isNaN(num)) return '0';
    const symbol = currency === 'SGD' ? 'SGD' : currency === 'USD' ? '$' : '₹';
    return `${symbol} ${Math.round(num).toLocaleString()}`;
  };

  // Convert between currencies
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const usdAmount = fromCurrency === 'USD' ? amount : amount / getRate(fromCurrency);
    return toCurrency === 'USD' ? usdAmount : usdAmount * getRate(toCurrency);
  };

  const getRate = (currency) => {
    const rates = { SGD: 1.35, USD: 1, INR: 83.12 }; // USD as base
    return rates[currency];
  };

  // Load data with currency conversion
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        if (parsed.currency) {
          setSelectedCurrency(parsed.currency);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  }, [data]);

  // Display values in selected currency
  const getDisplayValues = () => {
    const factor = convertCurrency(1, data.currency, selectedCurrency) / convertCurrency(1, data.currency, data.currency);
    return {
      total: data.total * factor,
      core: data.core * factor,
      growth: data.growth * factor,
      crypto: data.crypto * factor,
      hedge: data.hedge * factor,
      savings: data.savings * factor
    };
  };

  const displayData = getDisplayValues();

  const targets = {
    lean: convertCurrency(1850000, 'SGD', selectedCurrency),
    full: convertCurrency(2500000, 'SGD', selectedCurrency),
    core: convertCurrency(222400, 'SGD', selectedCurrency),
    growth: convertCurrency(48700, 'SGD', selectedCurrency),
    crypto: convertCurrency(73000, 'SGD', selectedCurrency),
    hedge: convertCurrency(146000, 'SGD', selectedCurrency)
  };

  const leanProgress = (displayData.total / targets.lean) * 100;
  const fullProgress = (displayData.total / targets.full) * 100;
  const passiveMonthly = (displayData.total * 0.04) / 12;

  const formatPercent = (num) => {
    if (!num || isNaN(num)) return '0.0';
    return num.toFixed(1);
  };

  const openEdit = () => {
    setEditValues({
      core: data.core.toLocaleString(),
      growth: data.growth.toLocaleString(),
      crypto: data.crypto.toLocaleString(),
      hedge: data.hedge.toLocaleString(),
      savings: data.savings.toLocaleString(),
      currency: data.currency
    });
    setShowEdit(true);
  };

  const parseNumber = (str) => {
    return Number(str.replace(/,/g, '')) || 0;
  };

  const formatInputValue = (value) => {
    const num = parseNumber(value);
    return num.toLocaleString();
  };

  const handleInputChange = (field, value) => {
    const numValue = parseNumber(value);
    setEditValues({
      ...editValues,
      [field]: numValue.toLocaleString()
    });
  };

  const saveEdit = () => {
    const newData = {
      core: parseNumber(editValues.core),
      growth: parseNumber(editValues.growth),
      crypto: parseNumber(editValues.crypto),
      hedge: parseNumber(editValues.hedge),
      savings: parseNumber(editValues.savings),
      currency: editValues.currency || data.currency
    };

    const newTotal = newData.core + newData.growth + newData.crypto + newData.hedge;
    
    setData({
      ...newData,
      total: newTotal
    });
    setShowEdit(false);
  };

  const getBucketStatus = (current, target) => {
    const percent = (current / target) * 100;
    if (percent >= 95 && percent <= 105) return 'text-green-400';
    if (percent >= 80 && percent <= 120) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Calculate years since start (motivation boost)
  const yearsInvesting = ((Date.now() - new Date('2020-01-01')) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
  const monthlyGrowthRate = (Math.pow(displayData.total / 50000, 1/(yearsInvesting * 12)) - 1) * 100; // Assuming started with 50k

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Currency Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Strategic Command Center</h1>
            <p className="text-gray-400">Investment Dashboard • {yearsInvesting} years building wealth</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
              <Globe className="h-4 w-4 text-gray-400" />
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="SGD">SGD</option>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <button 
              onClick={openEdit}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Update Portfolio
            </button>
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-green-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{formatPercent(monthlyGrowthRate)}%</div>
              <div className="text-sm text-gray-300">Monthly Growth Rate</div>
              <div className="text-xs text-gray-400">Compound magic working</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency((displayData.total - 50000), selectedCurrency)}</div>
              <div className="text-sm text-gray-300">Wealth Created</div>
              <div className="text-xs text-gray-400">From your discipline</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{formatCurrency(passiveMonthly, selectedCurrency)}</div>
              <div className="text-sm text-gray-300">Monthly Passive Income</div>
              <div className="text-xs text-gray-400">Money working for you</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Portfolio</span>
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(displayData.total, selectedCurrency)}</div>
            <div className="text-sm text-green-400">+{formatPercent(leanProgress)}% to Lean FI</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Passive Monthly</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(passiveMonthly, selectedCurrency)}</div>
            <div className="text-sm text-gray-400">4% withdrawal</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Lean FI Progress</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold">{formatPercent(leanProgress)}%</div>
            <div className="text-sm text-gray-400">{formatCurrency(targets.lean, selectedCurrency)} target</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Full FI Progress</span>
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{formatPercent(fullProgress)}%</div>
            <div className="text-sm text-gray-400">{formatCurrency(targets.full, selectedCurrency)} target</div>
          </div>
        </div>

        {/* FI Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Lean FI Progress</h3>
            <div className="mb-4">
              <div className="text-3xl font-bold">{formatPercent(leanProgress)}%</div>
              <div className="text-gray-400">{formatCurrency(displayData.total, selectedCurrency)} / {formatCurrency(targets.lean, selectedCurrency)}</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${Math.min(leanProgress, 100)}%`}}
              ></div>
            </div>
            <div className="text-sm text-gray-400">
              {formatCurrency(targets.lean - displayData.total, selectedCurrency)} remaining
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Full FI Progress</h3>
            <div className="mb-4">
              <div className="text-3xl font-bold">{formatPercent(fullProgress)}%</div>
              <div className="text-gray-400">{formatCurrency(displayData.total, selectedCurrency)} / {formatCurrency(targets.full, selectedCurrency)}</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${Math.min(fullProgress, 100)}%`}}
              ></div>
            </div>
            <div className="text-sm text-gray-400">
              {formatCurrency(targets.full - displayData.total, selectedCurrency)} remaining
            </div>
          </div>
        </div>

        {/* Portfolio Buckets */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Portfolio Buckets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-blue-400 mb-2">Core Growth</h4>
              <div className="text-xl font-bold">{formatCurrency(displayData.core, selectedCurrency)}</div>
              <div className="text-sm text-gray-400">Target: {formatCurrency(targets.core, selectedCurrency)}</div>
              <div className={`text-sm ${getBucketStatus(displayData.core, targets.core)}`}>
                {formatPercent((displayData.core / targets.core) * 100)}% of target
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-purple-400 mb-2">Alpha Growth</h4>
              <div className="text-xl font-bold">{formatCurrency(displayData.growth, selectedCurrency)}</div>
              <div className="text-sm text-gray-400">Target: {formatCurrency(targets.growth, selectedCurrency)}</div>
              <div className={`text-sm ${getBucketStatus(displayData.growth, targets.growth)}`}>
                {formatPercent((displayData.growth / targets.growth) * 100)}% of target
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-orange-400 mb-2">Crypto Hedge</h4>
              <div className="text-xl font-bold">{formatCurrency(displayData.crypto, selectedCurrency)}</div>
              <div className="text-sm text-gray-400">Target: {formatCurrency(targets.crypto, selectedCurrency)}</div>
              <div className={`text-sm ${getBucketStatus(displayData.crypto, targets.crypto)}`}>
                {formatPercent((displayData.crypto / targets.crypto) * 100)}% of target
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-green-400 mb-2">Stability Hedge</h4>
              <div className="text-xl font-bold">{formatCurrency(displayData.hedge, selectedCurrency)}</div>
              <div className="text-sm text-gray-400">Target: {formatCurrency(targets.hedge, selectedCurrency)}</div>
              <div className={`text-sm ${getBucketStatus(displayData.hedge, targets.hedge)}`}>
                {formatPercent((displayData.hedge / targets.hedge) * 100)}% of target
              </div>
            </div>
          </div>
        </div>

        {/* Trajectory */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Trajectory Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-green-400">{formatCurrency(displayData.total * 1.12 + (displayData.savings * 6), selectedCurrency)}</div>
              <div className="text-gray-400">End of 2025</div>
              <div className="text-sm text-gray-500">Projected value</div>
            </div>
            
            <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(displayData.total * 1.25 + (displayData.savings * 18), selectedCurrency)}</div>
              <div className="text-gray-400">End of 2026</div>
              <div className="text-sm text-gray-500">Projected value</div>
            </div>
            
            <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-purple-400">7</div>
              <div className="text-gray-400">Years to FI-2032</div>
              <div className="text-sm text-gray-500">Target timeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Update Portfolio</h3>
            
            {/* Currency Selector in Modal */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Base Currency
              </label>
              <select
                value={editValues.currency || data.currency}
                onChange={(e) => setEditValues({...editValues, currency: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="SGD">Singapore Dollar (SGD)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </select>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Core Growth ({editValues.currency || data.currency})
                </label>
                <input
                  type="text"
                  value={editValues.core || ''}
                  onChange={(e) => handleInputChange('core', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="105,356"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alpha Growth ({editValues.currency || data.currency})
                </label>
                <input
                  type="text"
                  value={editValues.growth || ''}
                  onChange={(e) => handleInputChange('growth', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="96,319"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Crypto Hedge ({editValues.currency || data.currency})
                </label>
                <input
                  type="text"
                  value={editValues.crypto || ''}
                  onChange={(e) => handleInputChange('crypto', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="101,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Stability Hedge ({editValues.currency || data.currency})
                </label>
                <input
                  type="text"
                  value={editValues.hedge || ''}
                  onChange={(e) => handleInputChange('hedge', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="170,050"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Monthly Savings ({editValues.currency || data.currency})
                </label>
                <input
                  type="text"
                  value={editValues.savings || ''}
                  onChange={(e) => handleInputChange('savings', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="7,000"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}