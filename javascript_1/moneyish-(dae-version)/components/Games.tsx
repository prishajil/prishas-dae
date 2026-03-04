
import React, { useState } from 'react';
import { Gamepad2, AlertTriangle, TrendingUp, PieChart, DollarSign } from 'lucide-react';

export const PriceIsRight: React.FC = () => {
  const items = [
    { name: "Latest Pro Smartphone", price: 1100 },
    { name: "Luxury Brand Hoodie", price: 450 },
    { name: "Next-Gen Gaming Console", price: 500 },
    { name: "Year of Music Streaming", price: 120 }
  ];
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleGuess = () => {
    const actual = items[current].price;
    const userGuess = parseInt(guess);
    const diff = Math.abs(userGuess - actual);
    if (diff < actual * 0.1) {
      setResult("Awesome! You're really close!");
    } else {
      setResult(`Not quite! The actual price is $${actual}.`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-teal-100 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-teal-800 mb-4 flex items-center gap-2">
        <Gamepad2 size={24} /> Price It Right!
      </h3>
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="bg-teal-50 p-6 rounded-2xl text-center">
          <p className="text-gray-500 mb-1">Guess the price of a...</p>
          <p className="text-2xl font-bold text-teal-900">{items[current].name}</p>
        </div>
        
        {result ? (
          <div className="text-center">
            <p className="font-bold text-teal-700 mb-4">{result}</p>
            <button 
              onClick={() => { setResult(null); setGuess(''); setCurrent((current + 1) % items.length); }}
              className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors"
            >
              Next Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="number" 
              value={guess} 
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess ($)"
              className="w-full border-2 border-teal-100 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-400"
            />
            <button 
              onClick={handleGuess}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
            >
              Guess!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const LoanShark: React.FC = () => {
  const [debt, setDebt] = useState(1000);
  const [cash, setCash] = useState(200);
  const [day, setDay] = useState(1);
  const [status, setStatus] = useState<string>("You borrowed $1,000. Interest is 15% DAILY! Pay it back fast.");

  const handleAction = (type: 'work' | 'pay') => {
    let newCash = cash;
    let newDebt = debt;
    
    if (type === 'work') {
      const earned = Math.floor(Math.random() * 100) + 50;
      newCash += earned;
      setStatus(`You worked a double shift and earned $${earned}.`);
    } else {
      const payment = Math.min(cash, debt);
      newCash -= payment;
      newDebt -= payment;
      setStatus(`You paid $${payment} towards your debt.`);
    }

    if (newDebt > 0) {
      const interest = Math.floor(newDebt * 0.15);
      newDebt += interest;
    }

    setCash(newCash);
    setDebt(newDebt);
    setDay(day + 1);

    if (newDebt <= 0) setStatus("VICTORY! You're free from the Loan Shark!");
    if (day >= 10 && newDebt > 0) setStatus("GAME OVER. The Loan Shark caught up to you!");
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-red-100 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">
        <AlertTriangle size={24} /> Loan Shark Game
      </h3>
      <p className="text-xs text-gray-500 mb-4">You have 10 days to clear your debt. 15% Daily Interest.</p>
      
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
            <span className="block text-xs font-bold text-red-400">DEBT</span>
            <span className="text-xl font-bold text-red-700">${debt}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
            <span className="block text-xs font-bold text-green-400">CASH</span>
            <span className="text-xl font-bold text-green-700">${cash}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-sm min-h-[80px] flex items-center justify-center text-center">
          {status}
        </div>

        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
           <span>Day {day} / 10</span>
        </div>

        {debt > 0 && day < 10 ? (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAction('work')} className="bg-teal-100 text-teal-800 py-3 rounded-xl font-bold hover:bg-teal-200">Work Shift</button>
            <button onClick={() => handleAction('pay')} disabled={cash <= 0} className="bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-300">Pay Debt</button>
          </div>
        ) : (
          <button onClick={() => {setDebt(1000); setCash(200); setDay(1); setStatus("Restarted!");}} className="w-full bg-teal-800 text-white py-3 rounded-xl font-bold">Try Again</button>
        )}
      </div>
    </div>
  );
};

export const StockSim: React.FC = () => {
    const [prices, setPrices] = useState({ tech: 100, green: 50, crypto: 20 });
    const [shares, setShares] = useState({ tech: 0, green: 0, crypto: 0 });
    const [cash, setCash] = useState(1000);
    const [day, setDay] = useState(1);

    const nextDay = () => {
        setDay(day + 1);
        setPrices({
            tech: Math.max(10, Math.floor(prices.tech * (0.8 + Math.random() * 0.4))),
            green: Math.max(5, Math.floor(prices.green * (0.9 + Math.random() * 0.2))),
            crypto: Math.max(1, Math.floor(prices.crypto * (0.3 + Math.random() * 1.5))),
        });
    };

    const trade = (stock: keyof typeof shares, type: 'buy' | 'sell') => {
        const price = prices[stock];
        if (type === 'buy' && cash >= price) {
            setCash(cash - price);
            setShares({ ...shares, [stock]: shares[stock] + 1 });
        } else if (type === 'sell' && shares[stock] > 0) {
            setCash(cash + price);
            setShares({ ...shares, [stock]: shares[stock] - 1 });
        }
    };

    const netWorth = cash + (shares.tech * prices.tech) + (shares.green * prices.green) + (shares.crypto * prices.crypto);

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-teal-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                <TrendingUp size={24} /> Stock Sim
            </h3>
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-400">Day {day}</span>
                <span className="text-xl font-bold text-teal-700">Net: ${netWorth}</span>
            </div>
            <div className="flex-1 space-y-4">
                {(['tech', 'green', 'crypto'] as const).map(stock => (
                    <div key={stock} className="flex items-center justify-between p-3 bg-teal-50 rounded-xl">
                        <div className="capitalize font-bold text-teal-900">{stock} <span className="text-xs text-gray-500 block">${prices[stock]}/share</span></div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => trade(stock, 'sell')} className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold hover:bg-red-200">-</button>
                            <span className="font-bold w-4 text-center">{shares[stock]}</span>
                            <button onClick={() => trade(stock, 'buy')} className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full font-bold hover:bg-green-200">+</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-teal-100 flex justify-between items-center">
                <span className="font-bold">Cash: ${cash}</span>
                <button onClick={nextDay} className="bg-teal-700 text-white px-6 py-2 rounded-full hover:bg-teal-600">Next Day</button>
            </div>
        </div>
    );
};
