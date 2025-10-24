import { supabase } from './client';
import type { MappingResult, TradmedConcept } from '@/types/tradmed';

export class DataService {
  private static instance: DataService;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Mapping Operations
  async saveMappingResult(mapping: MappingResult): Promise<void> {
    const { error } = await supabase
      .from('mappings')
      .insert({
        user_id: mapping.metadata.userId,
        tradmed_term: mapping.tradmedConcept.term,
        tradmed_system: mapping.tradmedConcept.system,
        icd11_code: mapping.icd11Entity.code,
        icd11_title: mapping.icd11Entity.title,
        confidence_score: mapping.confidenceScore,
        reasoning: mapping.reasoning,
        alternatives: mapping.alternatives,
        created_at: mapping.metadata.createdAt,
        updated_at: mapping.metadata.updatedAt
      });

    if (error) throw error;
  }

  async getMappingsByUser(userId: string): Promise<MappingResult[]> {
    const { data, error } = await supabase
      .from('mappings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getMappingById(mappingId: string): Promise<MappingResult | null> {
    const { data, error } = await supabase
      .from('mappings')
      .select('*')
      .eq('id', mappingId)
      .single();

    if (error) throw error;
    return data;
  }

  // Knowledge Base Operations
  async saveConcept(concept: TradmedConcept): Promise<void> {
    const { error } = await supabase
      .from('knowledge_concepts')
      .insert({
        id: concept.id,
        system: concept.system,
        title: concept.term,
        description: concept.description,
        properties: concept.properties,
        references: concept.references
      });

    if (error) throw error;
  }

  async searchConcepts(query: string, system?: string): Promise<TradmedConcept[]> {
    let queryBuilder = supabase
      .from('knowledge_concepts')
      .select('*')
      .textSearch('title', query, {
        type: 'websearch',
        config: 'english'
      });

    if (system) {
      queryBuilder = queryBuilder.eq('system', system);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data || [];
  }

  // Analytics Operations
  async getAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('mappings')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    if (!data) return null;

    const systemBreakdown = data.reduce((acc, m) => ({
      ...acc,
      [m.tradmed_system]: (acc[m.tradmed_system] || 0) + 1
    }), {} as Record<string, number>);

    const avgConfidence = data.reduce((sum, m) => sum + Number(m.confidence_score), 0) / data.length;

    // Calculate accuracy trend
    const accuracyByDate = data.reduce((acc, m) => {
      const date = new Date(m.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = { sum: 0, count: 0 };
      acc[date].sum += Number(m.confidence_score);
      acc[date].count++;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    const accuracyTrend = Object.entries(accuracyByDate)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, { sum, count }]) => ({
        date,
        accuracy: sum / count
      }));

    return {
      totalMappings: data.length,
      avgConfidence,
      systemBreakdown,
      accuracyTrend,
      recentMappings: data.slice(0, 5)
    };
  }

  // User Profile Operations
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<{
    full_name: string;
    role: string;
    settings: Record<string, any>;
  }>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();