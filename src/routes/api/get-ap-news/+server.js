import chromium from '@sparticuz/chromium';
// import puppeteer from 'puppeteer-core';
// import puppeteer from 'puppeteer';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

const puppeteer = dev ? await import('puppeteer') : await import('puppeteer-core');


const VIEWPORT_OPTIONS = {
	width: 1240, // A4 width at higher DPI
	height: 1754, // A4 height at higher DPI
	deviceScaleFactor: 2
};

const BROWSER_ARGS_DEV = ['--no-sandbox', '--disable-setuid-sandbox'];
const BROWSER_ARGS_PROD = [
	...chromium.args,
	'--no-sandbox',
	'--disable-setuid-sandbox',
	'--disable-dev-shm-usage',
	'--disable-accelerated-2d-canvas',
	'--no-first-run',
	'--no-zygote',
	'--disable-gpu'
];

const executablePath = dev ? undefined : await chromium.executablePath();
const browserArgs = dev ? BROWSER_ARGS_DEV : BROWSER_ARGS_PROD;

export async function POST({ request }) {
	const { url } = await request.json();
	let browser = null; // Initialize browser outside try

	if (!url) {
		throw error(400, 'URL is required');
	}

	browser = await puppeteer.launch({
		args: browserArgs,
		executablePath: executablePath,
		headless: dev ? 'new' : chromium.headless
	});

	const page = await browser.newPage();

	await page.goto(url, {
		waitUntil: 'networkidle2', // Keeping as per original code
		timeout: 60000 // Add a generous navigation timeout
	});

	console.log('Page loaded successfully');

	const textSelector = await page.locator('h1.Page-headline').waitHandle();
	const fullTitle = await textSelector?.evaluate((el) => el.textContent);

	const bodyDivSelector = await page.locator('.RichTextStoryBody.RichTextBody').waitHandle();
	const bodyText = await bodyDivSelector.evaluate((el) => {
		let textContent = '';
		for (const child of el.children) {
			if (child.tagName.toLowerCase() === 'p') {
				textContent += child.textContent + '\n\n';
			}
		}
		return textContent.trim();
	});

	console.log('Extracted title and body successfully');

	try {
		const images = await page.$$eval('.Carousel-slides .CarouselSlide', (slides) => {
			return slides
				.map((slide) => {
					const img = slide.querySelector('img');
					// Check src, then data-lazy, then srcset as fallbacks
					const url =
						img?.src || img?.getAttribute('data-flickity-lazyload') || img?.srcset?.split(' ')[0];

					// Target the p tag specifically within the info container
					const caption =
						slide.querySelector('.CarouselSlide-infoDescription p')?.innerText ||
						slide.querySelector('p')?.innerText ||
						'';

					return { url, caption };
				})
				.filter((item) => item.url); // Remove nulls
		});
		console.log('Extracted images successfully');
	} catch (err) {
		console.error('Error extracting images:', err);
	}

	return new Response(
		JSON.stringify({ title: fullTitle, body: bodyText, images: images ? images : [] }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
