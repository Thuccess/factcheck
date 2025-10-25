
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ClaimInput } from './components/ClaimInput';
import { ResultCard } from './components/ResultCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { verifyClaim } from './services/geminiService';
import { FactCheckResult } from './types';

const App: React.FC = () => {
  const [claim, setClaim] = useState<string>('');
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const examplePrompts = [
    "Fact-check: Uganda to join BRICS next month.",
    "Is this true: A new currency is being introduced in East Africa.",
    "Verify this claim: South Sudan bans foreign journalists from covering elections."
  ];

  const handleExampleClick = (prompt: string) => {
    setClaim(prompt);
  };

  const handleSubmit = async () => {
    if (!claim.trim()) {
      setError('Please enter a claim to verify.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const factCheckResult = await verifyClaim(claim);
      setResult(factCheckResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred while verifying the claim. The AI may be unable to parse the response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setClaim('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8">
          <ClaimInput
            claim={claim}
            setClaim={setClaim}
            onSubmit={handleSubmit}
            onClear={handleClear}
            isLoading={isLoading}
          />
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(prompt)}
                disabled={isLoading}
                className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 py-1 px-3 rounded-full transition-colors"
              >
                {prompt.split(':')[0]}...
              </button>
            ))}
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
            {result && <ResultCard result={result} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;