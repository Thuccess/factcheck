export enum Verdict {
  True = 'True / Verified',
  Misleading = 'Misleading / Needs Context',
  False = 'False / Fake',
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface FactCheckResult {
  claim: string;
  verdict: Verdict | string;
  explanation: string;
  sources: (Source | string)[];
  confidence: 'High' | 'Medium' | 'Low' | string;
}
