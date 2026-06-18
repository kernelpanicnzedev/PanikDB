import Anthropic from '@anthropic-ai/sdk';
import { RawProduct, AIAnalysis } from '../types';
import { lookupCorporateRecord } from '../data/corporateDatabase';

const SYSTEM_PROMPT = `You are PanikDB's AI analyst. You help consumers understand exactly what is in products and who makes them. Your job is to be honest, factual, and protective of consumer health and rights.

You provide:
1. Decoded ingredients (E-codes explained, chemical names simplified, actual function of each ingredient)
2. Health risks (specific risks per ingredient, chronic/acute/excessive consumption concerns)
3. Nutrition analysis (red flags, misleading claims)
4. Corporate intel — when a local database record is provided in the prompt, USE IT as your primary source and supplement with your training data. When no local record is available, use your training data and clearly state "Based on training data."

Always be factual. List specific documented violations, lawsuits, and recalls. Don't soften language — consumers deserve direct information.`;

function buildPrompt(product: RawProduct): string {
  const corpRecord = lookupCorporateRecord(product.brand);
  const corpContext = corpRecord
    ? `\n\nLOCAL CORPORATE DATABASE RECORD FOR "${corpRecord.name}":
Parent company: ${corpRecord.name}
HQ: ${corpRecord.hq || 'Unknown'}
Revenue: ${corpRecord.revenue || 'Unknown'}
Employees: ${corpRecord.employees || 'Unknown'}
Documented violations:
${corpRecord.violations.map(v => `- [${v.year}] ${v.type.toUpperCase()} (${v.agency}${v.penalty ? ', ' + v.penalty : ''}): ${v.description}`).join('\n')}
Total documented fines: ${corpRecord.totalFines}
Ethics rating in local DB: ${corpRecord.ethicsRating}
Known brands: ${corpRecord.brands.slice(0, 20).join(', ')}

USE THIS DATA in your corporateIntel response. This is documented, verified information.`
    : '';

  return `Analyze this consumer product and return a JSON object (no markdown, just raw JSON):${corpContext}

Product Name: ${product.name}
Brand: ${product.brand}
Categories: ${product.categories || 'Unknown'}
Labels: ${product.labels || 'None'}
Ingredients: ${product.ingredients || 'Not listed'}
Quantity: ${product.quantity || 'Unknown'}

Return this exact JSON structure:
{
  "ingredientsDecoded": [
    {
      "name": "ingredient name as listed",
      "decoded": "plain English name/what it actually is",
      "concern": "none|low|medium|high",
      "explanation": "what it does, why it's used, what it is"
    }
  ],
  "healthRisks": [
    {
      "ingredient": "ingredient name",
      "risk": "specific health risk",
      "severity": "low|medium|high",
      "context": "normal consumption|excessive consumption|prolonged use|specific populations"
    }
  ],
  "nutritionFlags": [
    {
      "flag": "description of nutritional concern or positive",
      "severity": "info|warning|danger"
    }
  ],
  "nutritionSummary": "2-3 sentence analysis of nutritional profile",
  "corporateIntel": {
    "parentCompany": "parent company name or 'Unknown'",
    "subsidiaries": ["list of known subsidiaries/brands"],
    "lawsuits": ["documented lawsuits with brief description"],
    "recalls": ["documented product recalls"],
    "environmentalViolations": ["documented environmental violations"],
    "laborViolations": ["documented labor violations"],
    "controversies": ["other controversies"],
    "ethicsRating": "poor|concerning|mixed|moderate|good",
    "ethicsExplanation": "2-3 sentence explanation of the ethics rating"
  },
  "overallRating": 7,
  "tldr": "One paragraph summary of what this product is, what's in it, who makes it, and whether consumers should be concerned.",
  "misleadingClaims": ["any misleading health/nutrition/sustainability claims on the label"]
}`;
}

export async function analyzeProduct(product: RawProduct, apiKey: string): Promise<AIAnalysis> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildPrompt(product),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  const text = content.text.trim();
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No JSON found in Claude response');
  }

  const analysis: AIAnalysis = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return analysis;
}
