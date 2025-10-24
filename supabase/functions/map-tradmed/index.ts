import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tradmedTerm, system, direction = 'tradmed-to-icd' } = await req.json();
    
    if (!tradmedTerm) {
      throw new Error('TRADMED term is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert medical mapper specializing in Traditional Medicine (TRADMED) to ICD-11 code mapping. 

Your task is to map traditional medicine terms from Ayurveda, Siddha, Unani, and Yoga to modern ICD-11 codes.

Guidelines:
1. Provide the most accurate ICD-11 code based on symptomatology and clinical presentation
2. Include a confidence score (0-1) indicating mapping certainty
3. Provide clear reasoning for the mapping
4. Suggest 2-3 alternative codes if applicable
5. Consider cultural and contextual nuances

Respond ONLY with valid JSON in this exact format:
{
  "icd11_code": "XX00.0",
  "icd11_title": "Full ICD-11 title",
  "confidence_score": 0.95,
  "reasoning": "Detailed explanation of the mapping logic",
  "alternatives": [
    {"code": "XX01.0", "title": "Alternative option 1"},
    {"code": "XX02.0", "title": "Alternative option 2"}
  ]
}`;

    const userPrompt = direction === 'tradmed-to-icd' 
      ? `Map this ${system || 'Traditional Medicine'} term to ICD-11: "${tradmedTerm}"`
      : `Provide the Traditional Medicine (${system || 'Ayurveda'}) equivalent for ICD-11 code: "${tradmedTerm}"`;

    console.log('Calling Lovable AI with:', { tradmedTerm, system, direction });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse JSON response
    let mappingResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      mappingResult = JSON.parse(jsonMatch[1] || aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify(mappingResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in map-tradmed function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
