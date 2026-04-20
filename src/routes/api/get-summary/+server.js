import OpenAI from 'openai';
// Use zodResponseFormat instead of zodTextFormat
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { OPENAI_API_KEY, OPENROUTER_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { title, body, images } = await request.json();

		const openai = new OpenAI({
			apiKey: OPENROUTER_API_KEY,
			baseURL: 'https://openrouter.ai/api/v1'
		});

		const NewsArticle = z.object({
			titles: z.array(z.string()).length(6),
			straplines: z.array(z.string()).length(6),
			bodyParagraphs: z.array(z.string().min(400).max(800)).length(5),
			images: z.array(
				z.object({
					url: z.string(),
					caption: z.string().max(200),
					attribution: z.string().max(100)
				})
			),
			tags: z.array(z.string()).length(5)
		});

		const prompt = `
			Give me 6 new headlines in around 10 words, few editorial style 12 words long straplines, 
			and rewrite the entire article in 350-400 words. 5 SEO words/tags (in 1 word each, maybe 2). In the headline, only capitalize the necessary words, not all words. 
			Italize event names, album names, song names, collection names, movie names and other such stuff. Don't include the {CITY} (AP) dateline in the strapline or body.
			All suitable to put up on a lifestyle magazine news website. Give me separate paragraphs.

			For the images, return the URL as it is given, the caption should be more or less the same but remove stuff like,
			"Photo by AP Photo/John Doe" and just return the actual caption. For attribution, only return the photographer's name, so in this case "John Doe".

			So a caption like,
			"Christopher Nolan, director of the upcoming film “The Odyssey,” speaks during the Universal Pictures and Focus Features presentation at CinemaCon on Wednesday, April 15, 2026, at Caesars Palace in Las Vegas. (AP Photo/Chris Pizzello)
			Should be returned as,
			{
				url: "...",
				caption: "Christopher Nolan, director of the upcoming film “The Odyssey,” speaks during the Universal Pictures and Focus Features presentation at CinemaCon",
				attribution: "Chris Pizzello"
			}

			Make sure it doesn't sound promotional or political. 
			Also, make sure all the words are spelt the UK way. \n

			Title: ${title}
			Body: ${body}
			Images: ${JSON.stringify(images)}
        `;

		const response = await openai.chat.completions.parse({
			model: 'google/gemini-3.1-pro-preview',
			messages: [
				{
					role: 'system',
					content:
						"You're an Indian journalist working at a news outlet tasked with re-writing news articles."
				},
				{
					role: 'user',
					content: prompt // Using the actual prompt string you built above
				}
			],
			response_format: zodResponseFormat(NewsArticle, 'news_article')
		});

		const output = response.choices[0].message.parsed;

		return new Response(JSON.stringify(output), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error occurred while fetching quintization:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch quintization' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
