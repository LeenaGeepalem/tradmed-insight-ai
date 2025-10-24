export interface TradmedSystem {
  id: string;
  name: 'Ayurveda' | 'Siddha' | 'Unani' | 'Yoga';
  description: string;
}

export interface TradmedConcept {
  id: string;
  system: TradmedSystem['name'];
  term: string;
  description: string;
  properties?: Record<string, string>;
  references?: string[];
}

export interface ICD11Entity {
  code: string;
  title: string;
  parentCode?: string;
  description?: string;
  inclusionTerms?: string[];
  exclusionTerms?: string[];
}

export interface MappingResult {
  id: string;
  tradmedConcept: TradmedConcept;
  icd11Entity: ICD11Entity;
  confidenceScore: number;
  reasoning: string;
  alternatives: Array<{
    entity: ICD11Entity;
    score: number;
    reasoning: string;
  }>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    userId: string;
    validatedBy?: string;
    status: 'pending' | 'validated' | 'rejected';
  };
}

export interface FHIRMappingResource {
  resourceType: 'ConceptMap';
  url: string;
  version: string;
  name: string;
  status: 'draft' | 'active' | 'retired';
  experimental: boolean;
  date: string;
  source: {
    uri: string;
    version: string;
  };
  target: {
    uri: string;
    version: string;
  };
  group: Array<{
    source: string;
    target: string;
    element: Array<{
      code: string;
      display?: string;
      target: Array<{
        code: string;
        display?: string;
        equivalence: 'equivalent' | 'wider' | 'subsumes' | 'narrower' | 'inexact';
        comment?: string;
      }>;
    }>;
  }>;
}