
import React, { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';

export const CollegeEstimator: React.FC = () => {
  const [tuition, setTuition] = useState(15000);
  const [years, setYears] = useState(4);
  const [aid, setAid] = useState(5000);

  const totalCost = (tuition * years) - (aid * years);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-teal-100 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-teal-800 mb-6 flex items-center gap-2">
        <Calculator size={24} /> College Cost Estimator
      </h3>
      
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-bold">Annual Tuition</label>
            <span className="text-teal-700 font-bold text-xl">${tuition.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="5000" 
            max="70000" 
            step="1000" 
            value={tuition} 
            onChange={(e) => setTuition(parseInt(e.target.value))}
            className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-bold">Years of Study</label>
            <span className="text-teal-700 font-bold text-xl">{years} Years</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="6" 
            step="1" 
            value={years} 
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-bold">Annual Grants/Aid</label>
            <span className="text-teal-700 font-bold text-xl">${aid.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="40000" 
            step="500" 
            value={aid} 
            onChange={(e) => setAid(parseInt(e.target.value))}
            className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-8 bg-teal-800 text-white p-6 rounded-2xl text-center shadow-xl transform hover:scale-105 transition-transform">
        <p className="text-teal-200 text-sm font-bold uppercase tracking-widest mb-1">Estimated Total Cost</p>
        <p className="text-4xl font-bold">${totalCost.toLocaleString()}</p>
      </div>
    </div>
  );
};
