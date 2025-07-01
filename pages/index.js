import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Eye, Globe, Brain, Award, AlertCircle, History } from 'lucide-react';

export default function IntelligentDashboard() {
  const [data, setData] = useState({
    total: 491132, // Updated with TSLA purchase
    savings: 7000,
    core: 105356,
    growth: 100441, // Updated: 96319 + 4122 (TSLA purchase)
    crypto: 101000,
    hedge: 170050,
    currency: 'SGD',
    
    historicalData: [
      { year: 2020, networth: 50000, totalSaved: 45000, notes: "Started journey" },
      { year: 2021, networth: 120000, totalSaved: 95000, notes: "Aggressive savings" },
      { year: 2022, networth: 180000, totalSaved: 155000, notes: "Market volatility" },
      { year: 2023, networth: 320000, totalSaved: 240000, notes: "Strong growth" },
      { year: 2024, networth: 450000, totalSaved: 320000, notes: "Consistent progress" },
      { year: 2025, networth: 491132, totalSaved: 350000, notes: "TSLA purchase at $305" }
    ]
  });

  const [showEdit, setShowEdit] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('SGD');
  const [claudeAdvice, setClaudeAdvice] = useState(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [editValues, setEditValues] = useState({});

  // Exchange rates
  const exchangeRates = { SGD: 1, USD: 0.74, INR: 61.5 };

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

  // Calculate metrics
  const latest = data.historicalData[data.historicalData.length - 1];
  const totalSaved = latest.totalSaved;
  const actualGains = latest.networth - totalSaved;
  const gainsPercentage = (actualGains / totalSaved) * 100;
  const years = 5.5;
  const cagr = (Math.pow(latest.networth / 50000, 1/years) - 1) * 100;

  const displayData = {
    total: convertToDisplayCurrency(data.total),
    core: convertToDisplayCurrency(data.core),
    growth: convertToDisplayCurrency(data.growth),
    crypto: convertToDisplayCurrency(data.crypto),
    hedge: convertToDisplayCurrency(data.hedge),
    actualGains: convertToDisplayCurrency(actualGains),
    totalSaved: convertToDisplayCurrency(totalSaved)
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

  // Portfolio health
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

  // AI Advice
  const getClaudeAdvice = async () => {
    setIsLoadingAdvice(true);
    const issues = getPortfolioHealth();
    
    setClaudeAdvice({
      urgentActions: [
        "Excellent TSLA timing at $305! Now consider trimming other single stocks",
        issues.length > 0 ? issues[0].action : "Maintain current allocation discipline"
      ],
      motivation: `Outstanding ${cagr.toFixed(1)}% CAGR over ${years} years! Your TSLA purchase shows great contrarian thinking.`,
      reasoning: "Your Alpha Growth bucket is now 20.5% vs 10% target. Consider rebalancing or boosting Core Growth.",
      impact: "Staying disciplined with allocation targets could accelerate FI by 6-12 months.",
      celebration: `SGD ${actualGains.toLocaleString()} in compound gains - your money is working hard!`
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
    setData({...data, ...newData, total: newTotal});
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
            <p className="text-gray-400">AI-Powered Investment Dashboard • {years} years building wealth</p>
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
                <h3 className="text-lg font-semibold text-purple-400 mb-3">AI Strategic Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-2">🎯 Priority Actions</h4>
                    <ul className="space-y-1">
                      {claudeAdvice.urgentActions?.map((action, index) => (
                        <li key={index} className="text-purple-100 text-sm">• {action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">💪 Motivation</h4>
                    <p className="text-purple-100 text-sm">{claudeAdvice.motivation}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-xs text-purple-200"><strong>Impact:</strong> {claudeAdvice.impact}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-green-500/20">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Wealth Building Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{formatPercent(cagr)}%</div>
              <div className="text-sm text-gray-300">Annual Growth (CAGR)</div>
              <div className="text-xs text-gray-400">{years} year track record</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(actualGains)}</div>
              <div className="text-sm text-gray-300">Compound Gains</div>
              <div className="text-xs text-gray-400">Money making money</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{formatCurrency(totalSaved)}</div>
              <div className="text-sm text-gray-300">Total Saved</div>
              <div className="text-xs text-gray-400">Your discipline</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{formatPercent(gainsPercentage)}%</div>
              <div className="text-sm text-gray-300">Return on Savings</div>
              <div className="text-xs text-gray-400">Beating benchmarks</div>
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
            <div className="text-2xl font-bold">{formatCurrency(displayData.total)}</div>
            <div className="text-sm text-green-400">+{formatPercent(leanProgress)}% to Lean FI</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Passive Monthly</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(passiveMonthly)}</div>
            <div className="text-sm text-gray-400">4% withdrawal</div>
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

        {/* Historical Journey */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Wealth Building Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.historicalData.map((entry) => (
              <div key={entry.year} className="text-center p-3 bg-gray-700 rounded">
                <div className="text-lg font-bold text-blue-400">{entry.year}</div>
                <div className="text-sm text-white">{formatCurrency(entry.networth)}</div>
                <div className="text-xs text-gray-400">Saved: {formatCurrency(entry.totalSaved)}</div>
                <div className="text-xs text-green-400">Gains: {formatCurrency(entry.networth - entry.totalSaved)}</div>
                <div className="text-xs text-gray-500 mt-1">{entry.notes}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Update Portfolio</h3>
            <div className="space-y-4 mb-6">
              {['core', 'growth', 'crypto', 'hedge', 'savings'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                    {field === 'growth' ? 'Alpha Growth (includes TSLA)' : field} (SGD)
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
                Save & Get AI Analysis
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