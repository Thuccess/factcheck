
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        Fact-Checker AI
      </h1>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        Your AI journalist for verifying news, claims, and posts. Enter a statement below to get an analysis based on reliable online data.
      </p>
    </header>
  );
};
