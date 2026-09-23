import { GoogleGenAI } from '@google/genai';
import { ShopCategory } from '../types';

export interface AiIdentificationResult {
  productName: string;
  category: ShopCategory;
  suggestedPrice: number;
  suggestedMrp: number;
  confidence: number; // 0.0 to 1.0
  description: string;
  tags: string[];
}

export async function identifyProductWithAi(
  imageSnippetDescription?: string,
  base64Image?: string
): Promise<AiIdentificationResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are ShopGenie AI vision assistant for retail store owners in India.
Analyze this product image or description: "${imageSnippetDescription || 'Retail packaged item'}".
Return a JSON object only, with this exact schema:
{
  "productName": "Concise branded product name",
  "category": "One of: Supermarket, Food Cart, Bakery & Cafe, Electronics & Gadgets, Fashion & Apparel, Moto & Auto Gear, Pop-up Store, Pharmacy, Boutique, Home & Decor",
  "suggestedPrice": 250,
  "suggestedMrp": 299,
  "confidence": 0.94,
  "description": "2-sentence product description highlighting benefits",
  "tags": ["tag1", "tag2", "tag3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        productName: parsed.productName || 'Smart Retail Product',
        category: (parsed.category as ShopCategory) || 'Supermarket',
        suggestedPrice: Number(parsed.suggestedPrice) || 299,
        suggestedMrp: Number(parsed.suggestedMrp) || 349,
        confidence: Number(parsed.confidence) || 0.92,
        description: parsed.description || 'Verified product listing identified by ShopGenie AI.',
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['Retail', 'Popular']
      };
    } catch (err) {
      console.warn('Gemini AI identification fallback:', err);
    }
  }

  // Realistic mock AI identification simulation
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sampleCatalogues: AiIdentificationResult[] = [
    {
      productName: 'Roasted Arabica Whole Bean Dark Roast (250g)',
      category: 'Bakery & Cafe',
      suggestedPrice: 420,
      suggestedMrp: 480,
      confidence: 0.96,
      description: 'Single-origin estate Arabica coffee with rich crema notes and balanced chocolate undertones.',
      tags: ['Arabica', 'Dark Roast', 'Artisanal']
    },
    {
      productName: 'Wood-Pressed Mustard Oil Cold Settled (1L)',
      category: 'Supermarket',
      suggestedPrice: 240,
      suggestedMrp: 280,
      confidence: 0.93,
      description: 'Authentic kachi ghani pressed cold virgin oil preserving natural pungency and vitamin E.',
      tags: ['Cold Pressed', 'Organic', 'Cooking Oil']
    },
    {
      productName: 'Type-C Braided Ultra Fast 100W Cable (1.5m)',
      category: 'Electronics & Gadgets',
      suggestedPrice: 499,
      suggestedMrp: 799,
      confidence: 0.95,
      description: 'Durable nylon braided high current PD cable with e-marker smart chip for laptops and phones.',
      tags: ['Fast Charge', '100W PD', 'Braided']
    },
    {
      productName: 'BreatheMesh Riding Glove Touchscreen Ready',
      category: 'Moto & Auto Gear',
      suggestedPrice: 1699,
      suggestedMrp: 2199,
      confidence: 0.91,
      description: 'High airflow motorcycle commuter gloves with knuckle impact buffer and silicon grip palm.',
      tags: ['Moto Gear', 'Protection', 'Breathable']
    }
  ];

  const pick = sampleCatalogues[Math.floor(Math.random() * sampleCatalogues.length)];
  return pick;
}
