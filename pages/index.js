import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Eye } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    total: 487010,
    savings: 7000,
    core: 105356,
    growth: 96319, 
    crypto: 101000,
    hedge: 170050
  });

  const [showEdit, setShowEdit] = useState(false);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  }, [data]);

  const targets = {
    lean: 1850000,
    full: 2500000,
    core: 222400,
    growth: 48700,
    crypto: 73000,
    hedge: 146000
  };

  const leanProgress = (data.total / targets.lean) * 100;
  const fullProgress = (data.total / targets.full) * 100;
  const passiveMonthly = (data.total * 0.04) / 12;

  const format = (num) => {
    if (!num || isNaN(num)) return '0';
    return Math.round(num).toLocaleString();
  };

  const formatPercent = (num) => {
    if (!num || isNaN(num)) return '0.0';
    return num.toFixed(1);
  };

  const openEdit = () => {
    setEditValues({...data});
    setShowEdit(true);
  };

  const saveEdit = () => {
    const newTotal = (Number(editValues.core) || 0) + 
                     (Number(editValues.growth) || 0) + 
                     (Number(editValues.crypto) || 0) + 
                     (Number(editValues.hedge) || 0);
    
    setData({
      ...editValues,
      total: newTotal,
      savings: Number(editValues.savings) || 0
    });
    setShowEdit(false);
  };

  const getBucketStatus = (current, target) => {
    const percent = (current / target) * 100;
    if (percent >= 95 && percent <= 105) return 'text-green-400';
    if (percent >= 80 && percent <= 120) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Strategic Command Center</h1>
            <p className="text-gray-400">Investment Dashboard</p>
          </div>
          <button 
            onClick={openEdit}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            Update Portfolio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Portfolio</span>
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">SGD {format(data.total)}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Passive Monthly</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">SGD {format(passiveMonthly)}</div>
            <div className="text-sm text-gray-400">4% withdrawal</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Lean FI Progress</span>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold">{formatPercent(leanProgress)}%</div>
            <div className="text-sm text-gray-400">SGD 1.85M target</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Full FI Progress</span>
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{formatPercent(fullProgress)}%</div>
            <div className="text-sm text-gray-400">SGD 2.5M target</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Lean FI Progress</h3>
            <div className="mb-4">
              <div className="text-3xl font-bold">{formatPercent(leanProgress)}%</div>
              <div className="text-gray-400">SGD {format(data.total)} / SGD 1.85M</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${Math.min(leanProgress, 100)}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Full FI Progress</h3>
            <div className="mb-4">
              <div className="text-3xl font-bold">{formatPercent(fullProgress)}%</div>
              <div className="text-gray-400">SGD {format(data.total)} / SGD 2.5M</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${Math.min(fullProgress, 100)}%`}}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Portfolio Buckets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-blue-400 mb-2">Core Growth</h4>
              <div className="text-xl font-bold">SGD {format(data.core)}</div>
              <div className="text-sm text-gray-400">Target: SGD {format(targets.core)}</div>
              <div className={`text-sm ${getBucketStatus(data.core, targets.core)}`}>
                {formatPercent((data.core / targets.core) * 100)}% of target
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-purple-400 mb-2">Alpha Growth</h4>
              <div className="text-xl font-bold">SGD {format(data.growth)}</div>
              <div className="text-sm text-gray-400">Target: SGD {format(targets.growth)}</div>
              <div className={`text-sm ${getBucketStatus(data.growth, targets.growth)}`}>
                {formatPercent((data.growth / targets.growth) * 100)}% of target
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-orange-400 mb-2">Crypto Hedge</h4>
              <div className="text-xl font-bold">SGD {format(data.crypto)}</div>
              <div className="text-sm text-gray-400">Target: SGD {format(targets.crypto)}</div>
              <div className={`text-sm ${getBucketStatus(data.crypto, targets.crypto)}`}>
                {formatPercent((data.crypto / targets.crypto) * 100)}% of target
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="font-medium text-green-400 mb-2">Stability Hedge</h4>
              <div className="text-xl font-bold">SGD {format(data.hedge)}</div>
              <div className="text-sm text-gray-400">Target: SGD {format(targets.hedge)}</div>
              <div className={`text-sm ${getBucketStatus(data.hedge, targets.hedge)}`}>
                {formatPercent((data.hedge / targets.hedge) * 100)}% of target
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Trajectory Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-green-400">SGD {format(data.total * 1.12 + (data.savings * 6))}</div>
              <div className="text-gray-400">End of 2025</div>
              <div className="text-sm text-gray-500">Projected value</div>
            </div>
            
            <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">SGD {format(data.total * 1.25 + (data.savings * 18))}</div>
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

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Update Portfolio</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Core Growth (SGD)
                </label>
                <input
                  type="number"
                  value={editValues.core || ''}
                  onChange={(e) => setEditValues({...editValues, core: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alpha Growth (SGD)
                </label>
                <input
                  type="number"
                  value={editValues.growth || ''}
                  onChange={(e) => setEditValues({...editValues, growth: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Crypto Hedge (SGD)
                </label>
                <input
                  type="number"
                  value={editValues.crypto || ''}
                  onChange={(e) => setEditValues({...editValues, crypto: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Stability Hedge (SGD)
                </label>
                <input
                  type="number"
                  value={editValues.hedge || ''}
                  onChange={(e) => setEditValues({...editValues, hedge: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Monthly Savings (SGD)
                </label>
                <input
                  type="number"
                  value={editValues.savings || ''}
                  onChange={(e) => setEditValues({...editValues, savings: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
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
