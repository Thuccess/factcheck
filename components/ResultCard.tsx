import React, { useState } from 'react';
import { FactCheckResult, Verdict } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { XIcon } from './icons/XIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { CopyIcon } from './icons/CopyIcon';

interface ResultCardProps {
  result: FactCheckResult;
}

const getVerdictStyles = (verdict: Verdict | string) => {
  switch (verdict) {
    case Verdict.True:
      return {
        bgColor: 'bg-green-900/50',
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        icon: <CheckIcon className="w-8 h-8" />
      };
    case Verdict.Misleading:
      return {
        bgColor: 'bg-yellow-900/50',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-400',
        icon: <WarningIcon className="w-8 h-8" />
      };
    case Verdict.False:
      return {
        bgColor: 'bg-red-900/50',
        borderColor: 'border-red-500',
        textColor: 'text-red-400',
        icon: <XIcon className="w-8 h-8" />
      };
    default:
      return {
        bgColor: 'bg-gray-800',
        borderColor: 'border-gray-600',
        textColor: 'text-gray-400',
        icon: <WarningIcon className="w-8 h-8" />
      };
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { verdict, claim, explanation, sources, confidence } = result;
  const styles = getVerdictStyles(verdict);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Claim: "${claim}"\n\nVerdict: ${verdict}\n\nExplanation: ${explanation}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className={`border-l-4 ${styles.borderColor} ${styles.bgColor} p-6 rounded-lg shadow-lg animate-fade-in`}>
      <div className="flex items-start sm:items-center gap-4">
        <div className={`flex-shrink-0 ${styles.textColor}`}>
          {styles.icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">Claim</p>
          <h2 className="text-lg font-semibold text-gray-100">"{claim}"</h2>
        </div>
      </div>
      
      <div className="mt-5">
        <h3 className={`text-xl font-bold ${styles.textColor}`}>{verdict}</h3>
        <p className="mt-2 text-gray-300">{explanation}</p>
      </div>

      {sources && sources.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sources</h4>
          <div className="mt-2 space-y-3">
            {sources.map((source, index) => {
              const isString = typeof source === 'string';
              const url = isString ? source : source.url;
              const title = isString ? source : source.title;
              const snippet = isString ? undefined : source.snippet;
              const isUrl = url && url.startsWith('http');

              return (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  {isUrl ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold flex items-center gap-1.5 transition-colors">
                      <ExternalLinkIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="break-all">{title}</span>
                    </a>
                  ) : (
                    <span className="text-gray-300 font-semibold break-all">{title}</span>
                  )}
                  {snippet && (
                    <blockquote className="mt-2 text-sm text-gray-400 border-l-2 border-gray-600 pl-3 italic">
                      "{snippet}"
                    </blockquote>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Confidence Level:</span> {confidence}
        </p>
        <button
          onClick={handleCopy}
          disabled={isCopied}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-default"
        >
          <CopyIcon className="w-4 h-4" />
          {isCopied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};