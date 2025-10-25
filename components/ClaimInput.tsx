
import React from 'react';
import { ClearIcon } from './icons/ClearIcon';

interface ClaimInputProps {
  claim: string;
  setClaim: (claim: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const ClaimInput: React.FC<ClaimInputProps> = ({ claim, setClaim, onSubmit, onClear, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative">
      <textarea
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter news, a claim, or paste a social media post to fact-check..."
        className="w-full h-32 p-4 pr-28 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 resize-none transition-colors"
        disabled={isLoading}
      />
      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
        {claim && !isLoading && (
          <button
            onClick={onClear}
            className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-all transform hover:scale-110"
            aria-label="Clear Input"
          >
            <ClearIcon className="h-5 w-5 text-white" />
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={isLoading || !claim.trim()}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-110"
          aria-label="Verify Claim"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};