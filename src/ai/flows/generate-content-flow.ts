'use server';
/**
 * @fileOverview A flow for generating educational content for a Signals and Systems textbook.
 *
 * - generateContent - A function that generates a new content block (slide) using AI.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateContentInputSchema = z.object({
  topic: z.string().describe('The specific topic or question the user wants content for. For example, "Explain the concept of convolution".'),
  context: z.string().describe('The title of the section this content will be part of, to provide context. For example, "Propiedades básicas de los sistemas".'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

export const GenerateContentOutputSchema = z.object({
  html: z.string().describe('The generated content as a single, well-formatted HTML string. It MUST use <h2> for the main title, <p> for paragraphs. For mathematical formulas, it MUST use MathJax format, enclosed in $$...$$.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;


const generationPrompt = ai.definePrompt({
    name: 'generateContentPrompt',
    input: { schema: GenerateContentInputSchema },
    output: { schema: GenerateContentOutputSchema },
    prompt: `You are an expert university professor specializing in Signals and Systems.
    Your task is to generate a new educational slide (as an HTML block) for a digital textbook.

    The slide should be about the topic: "{{topic}}".
    It will be placed within the section titled: "{{context}}".

    Generate a clear, concise, and well-structured explanation.
    The output MUST be a single HTML string.
    - Use an <h2> tag for the main title of the slide.
    - Use <p> tags for all explanatory text.
    - Use MathJax format for all mathematical equations, enclosing them in $$...$$. For example: $$x(t) = A \\cos(\\omega_0 t + \\phi)$$.
    - Ensure the generated HTML is clean and ready to be inserted into a div.
    `,
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const { output } = await generationPrompt(input);
    return output!;
  }
);

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}
