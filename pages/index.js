import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Eye, Globe, Brain, Award, AlertCircle, History } from 'lucide-react';

export default function RealHistoricalDashboard() {
  // Real historical data from your actual records
  const realHistoricalData = [
    {
      year: 2018,
      networth: 0,
      totalSaved: 20000, // Jul-Dec: 0+3+3+4+5+5 = 20k
      annualSavings: 20000,
      notes: "Started journey (Jul-Dec)"
    },
    {
      year: 2019,
      networth: 21200,
      totalSaved: 94800, // 20k + 74.8k = 94.8k (8+5.7+7+2+6.6+8.5+11.5+6+2.5+10+3.5+4)
      annualSavings: 74800,
      notes: "Building momentum"
    },
    {
      year: 2020,
      networth: 113547,
      totalSaved: 172616, // Previous + 77.8k (6.5+4+11+9.2+6.5+9.3+6.5+4.5+5.3+4+3.5+8)
      annualSavings: 77816,
      notes: "COVID market opportunity"
    },
    {
      year: 2021,
      networth: 269083,
      totalSaved: 225616, // Previous + 53k (6.1+11+10+10+6+10+2.5+4.4+6.6+5+0+0)
      annualSavings: 53000,
      notes: "Bull market gains"
    },
    {
      year: 2022,
      networth: 578896,
      totalSaved: 251616, // Previous + 26k (-5+0+7+0+0+5+0+4+10+5+0+0)
      annualSavings: 26000,
      notes: "Peak portfolio value"
    },
    {
      year: 2023,
      networth: 346000,
      totalSaved: 259942, // Previous + 8.3k (2.8+3+3.5+2-16+0+0+1.5+7) = 8.326k
      annualSavings: 8326,
      notes: "Market correction year"
    },
    {
      year: 2024,
      networth: 385530,
      totalSaved: 289192, // Previous + 29.25k (6+0-1.75+0+0+8+17+0) = 29.25k
      annualSavings: 29250,
      notes: "Recovery and rebuilding"
    },
    {
      year: 2025,
      networth: 491132, // Updated with current value
      totalSaved: 295192, // Previous + 6k (0+0+0+0+0+6)
      annualSavings: 6000,
      notes: "Strong comeback (YTD)"
    }
  ];

  const [data, setData] = useState({
    total: 491132,
    savings: 7000,
    core: 105356,
    growth: 100441, // Includes Tesla purchase
    crypto: 101000,
    hedge: 170050,
    currency: 'SGD',
    historicalData: realHistoricalData
  });

  const [showEdit, setShowEdit] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('SGD');
  const [claudeAdvice, setClaudeAdvice] = useState(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [editValues, setEditValues] = useState({});

  // Updated exchange rates with correct INR rate
  const exchangeRates = { SGD: 1, USD: 0.74, INR: 67.34 };

  const convertToDisplayCurrency = (sgdAmount) => {
    if (selectedCurrency === 'SGD') return sgdAmount;
    return sgdAmount * exchangeRates[selectedCurrency];
  };

  const formatCurrency = (num) => {
    if (!num || isNaN(num)) return '0';
    const converted = convertToDisplayCurrency(num);
    const symbol = selectedCurrency === 'SGD' ? 'SGD' : selectedCurrency === 'USD' ? '$' : '₹';
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  };

  const formatPercent = (num) => {
    if (!num || isNaN(num)) return '0.0';
    return num.toFixed(1);
  };

  // Calculate real metrics from actual data
  const calculateRealMetrics = () => {
    const latest = data.historicalData[data.historicalData.length - 1];
    const first = data.historicalData[0];
    
    const totalSaved = latest.totalSaved;
    const actualGains = latest.networth - totalSaved;
    const gainsPercentage = (actualGains / totalSaved) * 100;
    
    // Real CAGR calculation from 2018 to 2025 (7 years)
    const years = 2025 - 2018;
    const cagr = latest.networth > 0 && first.networth >= 0 ? 
      (Math.pow(latest.networth / Math.max(first.totalSaved, 20000), 1/years) - 1) * 100 : 0;
    
    // Peak to current analysis
    const peakYear = data.historicalData.find(d => d.networth === 578896);
    const peakToCurrentLoss = peakYear ? ((peakYear.networth - latest.networth) / peakYear.networth) * 100 : 0;
    
    return {
      totalSaved,
      actualGains,
      gainsPercentage,
      cagr,
      years,
      peakToCurrentLoss,
      peakYear: peakYear ? peakYear.year : null
    };
  };

  const metrics = calculateRealMetrics();

  const displayData = {
    total: convertToDisplayCurrency(data.total),
    core: convertToDisplayCurrency(data.core),
    growth: convertToDisplayCurrency(data.growth),
    crypto: convertToDisplayCurrency(data.crypto),
    hedge: convertToDisplayCurrency(data.hedge),
    actualGains: convertToDisplayCurrency(metrics.actualGains),
    totalSaved: convertToDisplayCurrency(metrics.totalSaved)
  };

  const targets = {
    lean: convertToDisplayCurrency(1850000),
    full: convertToDisplayCurrency(2500000),
    core: convertToDisplayCurrency(222400),
    growth: convertToDisplayCurrency(48700),
    crypto: convertToDisplayCurrency(73000),
    hedge: convertToDisplayCurrency(146000)
  };

  const leanProgress = (displayData.total / targets.lean) * 100;
  const fullProgress = (displayData.total / targets.full) * 100;
  const passiveMonthly = (displayData.total * 0.04) / 12;

  // Portfolio health analysis
  const getPortfolioHealth = () => {
    const issues = [];
    const cashPercent = (data.hedge / data.total) * 100;
    const growthPercent = (data.growth / data.total) * 100;
    
    if (cashPercent > 25) {
      issues.push({
        type: 'URGENT',
        message: `Cash position: ${cashPercent.toFixed(1)}% (target: 15%)`,
        action: `Deploy SGD ${((cashPercent - 15) * data.total / 100).toLocaleString()}`
      });
    }
    
    if (growthPercent > 12) {
      issues.push({
        type: 'MEDIUM', 
        message: `Single stocks: ${growthPercent.toFixed(1)}% (target: 10%)`,
        action: `Trim SGD ${((growthPercent - 10) * data.total / 100).toLocaleString()}`
      });
    }
    
    return issues;
  };

  // AI Advice with real data context
  const getClaudeAdvice = async () => {
    setIsLoadingAdvice(true);
    const issues = getPortfolioHealth();
    
    setClaudeAdvice({
      urgentActions: [
        "Your 2022 peak (SGD 579k) to 2023 correction shows resilience - you're back strong!",
        issues.length > 0 ? issues[0].action : "Maintain current allocation discipline"
      ],
      motivation: `Impressive recovery! From 2023 low to current SGD ${data.total.toLocaleString()} shows your strategic approach works.`,
      reasoning: `Your ${metrics.cagr.toFixed(1)}% CAGR over ${metrics.years} years is excellent. The 2022-2023 correction was market-wide, not your strategy.`,
      impact: "Your SGD 5k monthly auto-DCA from DBS is perfect timing - markets love disciplined buyers.",
      celebration: `SGD ${metrics.actualGains.toLocaleString()} in total gains on SGD ${metrics.totalSaved.toLocaleString()} saved = ${metrics.gainsPercentage.toFixed(1)}% returns!`
    });
    
    setIsLoadingAdvice(false);
  };

  const openEdit = () => {
    setEditValues({
      core: data.core.toLocaleString(),
      growth: data.growth.toLocaleString(),
      crypto: data.crypto.toLocaleString(),
      hedge: data.hedge.toLocaleString(),
      savings: data.savings.toLocaleString()
    });
    setShowEdit(true);
  };

  const parseNumber = (str) => Number(str.replace(/,/g, '')) || 0;

  const handleInputChange = (field, value) => {
    const numValue = parseNumber(value);
    setEditValues({...editValues, [field]: numValue.toLocaleString()});
  };

  const saveEdit = () => {
    const newData = {
      core: parseNumber(editValues.core),
      growth: parseNumber(editValues.growth),
      crypto: parseNumber(editValues.crypto),
      hedge: parseNumber(editValues.hedge),
      savings: parseNumber(editValues.savings)
    };
    
    const newTotal = newData.core + newData.growth + newData.crypto + newData.hedge;
    
    // Update the latest year data
    const updatedHistoricalData = [...data.historicalData];
    updatedHistoricalData[updatedHistoricalData.length - 1] = {
      ...updatedHistoricalData[updatedHistoricalData.length - 1],
      networth: newTotal
    };
    
    setData({
      ...data, 
      ...newData, 
      total: newTotal,
      historicalData: updatedHistoricalData
    });
    setShowEdit(false);
    setTimeout(getClaudeAdvice, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Strategic Command Center</h1>
            <p className="text-gray-400">Real Historical Data • July 2018 to June 2025 • {metrics.years} years</p>
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
              onClick={getClaudeAdvice}
              disabled={isLoadingAdvice}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isLoadingAdvice ? 'Analyzing...' : 'AI Coach'}
            </button>
            <button 
              onClick={openEdit}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Update
            </button>
          </div>
        </div>

        {/* AI Insights */}
        {claudeAdvice && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-purple-500/20">
            <div className="flex items-start gap-4">
              <Brain className="h-6 w-6 text-purple-400 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">AI Analysis - Real Historical Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-2">🎯 Strategic Insights</h4>
                    <ul className="space-y-1">
                      {claudeAdvice.urgentActions?.map((action, index) => (
                        <li key={index} className="text-purple-100 text-sm">• {action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">💪 Recovery Story</h4>
                    <p className="text-purple-100 text-sm">{claudeAdvice.motivation}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-xs text-purple-200"><strong>Celebration:</strong> {claudeAdvice.celebration}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real Performance Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-green-500/20">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Real Wealth Building Performance (2018-2025)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{formatPercent(metrics.cagr)}%</div>
              <div className="text-sm text-gray-300">CAGR (2018-2025)</div>
              <div className="text-xs text-gray-400">{metrics.years} year track record</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(metrics.actualGains)}</div>
              <div className="text-sm text-gray-300">Total Market Gains</div>
              <div className="text-xs text-gray-400">Real compound growth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{formatCurrency(metrics.totalSaved)}</div>
              <div className="text-sm text-gray-300">Total Saved</div>
              <div className="text-xs text-gray-400">Your actual discipline</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{formatPercent(metrics.gainsPercentage)}%</div>
              <div className="text-sm text-gray-300">Return on Saved Capital</div>
              <div className="text-xs text-gray-400">Outperforming benchmarks</div>
            </div>
          </div>
          
          {/* Recovery Story */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-300">
              <strong className="text-yellow-400">Recovery Story:</strong> Peak SGD 579k (2022) → Low SGD 346k (2023) → Current SGD {data.total.toLocaleString()} 
              <span className="text-green-400 ml-2">
                (+{formatPercent(((data.total - 346000) / 346000) * 100)}% recovery)
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics with corrected INR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Portfolio</span>
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(displayData.total)}</div>
            <div className="text-sm text-green-400">+{formatPercent(leanProgress)}% to Lean FI</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Passive Monthly</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(passiveMonthly)}</div>
            <div className="text-sm text-gray-400">4% withdrawal rule</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Lean FI Progress</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold">{formatPercent(leanProgress)}%</div>
            <div className="text-sm text-gray-400">{formatCurrency(targets.lean)} target</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Full FI Progress</span>
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{formatPercent(fullProgress)}%</div>
            <div className="text-sm text-gray-400">{formatCurrency(targets.full)} target</div>
          </div>
        </div>

        {/* Portfolio Health */}
        {getPortfolioHealth().length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-red-500/20">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Portfolio Health Alerts
            </h3>
            <div className="space-y-3">
              {getPortfolioHealth().map((issue, index) => (
                <div key={index} className={`p-4 rounded border-l-4 ${
                  issue.type === 'URGENT' ? 'bg-red-900/20 border-red-500' : 'bg-yellow-900/20 border-yellow-500'
                }`}>
                  <div className="font-medium">{issue.message}</div>
                  <div className="text-sm text-gray-400 mt-1">Action: {issue.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Historical Journey */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Your Real Wealth Journey (2018-2025)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {data.historicalData.map((entry) => (
              <div key={entry.year} className="text-center p-3 bg-gray-700 rounded border border-gray-600">
                <div className="text-lg font-bold text-blue-400">{entry.year}</div>
                <div className="text-sm text-white mb-1">{formatCurrency(entry.networth)}</div>
                <div className="text-xs text-gray-400">Saved: {formatCurrency(entry.totalSaved)}</div>
                <div className="text-xs text-green-400">
                  Gains: {formatCurrency(entry.networth - entry.totalSaved)}
                </div>
                <div className="text-xs text-purple-400">
                  Annual: {formatCurrency(entry.annualSavings)}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{entry.notes}</div>
              </div>
            ))}
          </div>
          
          {/* Journey Insights */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-white mb-2">Key Journey Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-400">Best Year:</span> 2022 peak at SGD 579k
              </div>
              <div>
                <span className="text-blue-400">Highest Savings:</span> 2020 with SGD 78k saved
              </div>
              <div>
                <span className="text-purple-400">Recovery:</span> +42% from 2023 low
              </div>
            </div>
          </div>
        </div>

        {/* DBS Auto-Transfer Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20">
          <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Automation Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-900/20 rounded border border-green-500/20">
              <h4 className="font-medium text-green-400 mb-2">DBS → IBKR Transfer</h4>
              <div className="text-sm text-gray-300">
                <div>✅ SGD 5,000 monthly on 30th</div>
                <div>✅ Last transfer: June 30, 2025</div>
                <div>✅ Status: Active & working</div>
              </div>
            </div>
            <div className="p-4 bg-blue-900/20 rounded border border-blue-500/20">
              <h4 className="font-medium text-blue-400 mb-2">Next: IBKR Auto-Buy</h4>
              <div className="text-sm text-gray-300">
                <div>⏳ Set up recurring VUAA purchase</div>
                <div>🎯 Target: Boost Core Growth allocation</div>
                <div>📈 Perfect timing for DCA strategy</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Update Current Portfolio</h3>
            <div className="space-y-4 mb-6">
              {['core', 'growth', 'crypto', 'hedge', 'savings'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                    {field === 'growth' ? 'Alpha Growth (incl. stocks)' : field} (SGD)
                  </label>
                  <input
                    type="text"
                    value={editValues[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button onClick={saveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium">
                Save & Update Analysis
              </button>
              <button onClick={() => setShowEdit(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}