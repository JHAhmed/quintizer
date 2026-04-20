<script>
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { onMount } from 'svelte';
	import { toast, Toaster } from 'svelte-sonner';

	let link = $state('');

	let _quintTitles = $state([
		'Nolan, Spielberg and Universal packed CinemaCon with clips, applause and industry talk',
		'Fresh footage, secretive projects and theatrical windows shaped the day’s presentations',
		'*The Odyssey* and *Disclosure Day* offered a polished reminder of cinema’s pull',
		'Studios leaned on big names, original stories and the theatre experience',
		'Snoop Dogg’s film announcement added a lighter note to Universal’s line-up',
		'Universal’s presentation mixed star power with box-office strategy and upcoming releases'
	]);
	let _quintStraplines = $state([
		'Nolan, Spielberg and Universal packed CinemaCon with clips, applause and industry talk',
		'Fresh footage, secretive projects and theatrical windows shaped the day’s presentations',
		'*The Odyssey* and *Disclosure Day* offered a polished reminder of cinema’s pull',
		'Studios leaned on big names, original stories and the theatre experience',
		'Snoop Dogg’s film announcement added a lighter note to Universal’s line-up',
		'Universal’s presentation mixed star power with box-office strategy and upcoming releases'
	]);
	let _quintParagraphs = $state([
		'Nolan, Spielberg and Universal packed CinemaCon with clips, applause and industry talk ',
		'Fresh footage, secretive projects and theatrical windows shaped the day’s presentations',
		'*The Odyssey* and *Disclosure Day* offered a polished reminder of cinema’s pull',
		'Studios leaned on big names, original stories and the theatre experience',
		'Snoop Dogg’s film announcement added a lighter note to Universal’s line-up'
	]);
	let _quintImages = $state([
		{
			attribution: 'John Locher',
			url: 'https://dims.apnews.com/dims4/default/222074f/2147483647/strip/true/crop/5366x3577+0+0/resize/1440x960!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fa9%2F28%2F42de447207d036698e78f97a0287%2F34af4216f8ef434dbb9c3bbbd691dde8',
			caption:
				'Christopher Nolan speaks during the Universal Pictures presentation at CinemaCon 2024, Wednesday, April 24, 2024, in Las Vegas. (AP Photo/John Locher)'
		},
		{
			attribution: 'John Locher',
			url: 'https://dims.apnews.com/dims4/default/222074f/2147483647/strip/true/crop/5366x3577+0+0/resize/1440x960!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fa9%2F28%2F42de447207d036698e78f97a0287%2F34af4216f8ef434dbb9c3bbbd691dde8',
			caption:
				'Christopher Nolan speaks during the Universal Pictures presentation at CinemaCon 2024, Wednesday, April 24, 2024, in Las Vegas. (AP Photo/John Locher)'
		}
	]);
	let _quintTags = $state(['Test tag 1', 'Test tag 2', 'Test tag 3', 'Test tag 4', 'Test tag 5']);

	let quintTitles = $state([]);
	let quintStraplines = $state([]);
	let quintParagraphs = $state([]);
	let quintImages = $state([]);
	let quintTags = $state([]);

	let title = $state('');
	let body = $state(``);
	let images = $state([]);

	let loading = $state(false);

	async function getQuintization() {
		const res = await fetch('/api/get-summary', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, body, images })
		});
		const data = await res.json();

		if (res.ok) {
			quintTitles = data.titles;
			quintStraplines = data.straplines;
			quintParagraphs = data.bodyParagraphs;
			quintImages = data.images;
			quintTags = data.tags;
		}
	}

	async function handleQuintization() {
		if (!title || title.trim() === '' || !body || body.trim() === '') {
			toast.error('Please enter a valid title and body before quintizing.');
			return;
		}

		loading = true;
		toast.promise(getQuintization(), {
			loading: 'Quintizing AP News...',
			success: 'AP News quintized successfully!',
			error: 'Failed to quintize AP News.'
		});
		loading = false;
	}

	async function getNews() {
		const res = await fetch('/api/get-ap-news', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: link })
		});

		const data = await res.json();

		if (res.ok) {
			title = data.title;
			body = data.body;
			images = data.images;
		}
	}

	async function handleClick() {
		if (!link || link.trim() === '') {
			toast.error('Please enter a link.');
			return;
		}

		loading = true;
		toast.promise(getNews(), {
			loading: 'Fetching AP News...',
			success: 'AP News fetched successfully!',
			error: 'Failed to fetch AP News.'
		});
		loading = false;
	}

	const handleCopy = (text) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard!');
	};
</script>

<Toaster richColors position="bottom-center" />

<main class="min-h-screen bg-gray-50 p-4 md:p-16">
	{#if !title && !body && quintTitles.length === 0}
		<div class="flex max-w-7xl flex-col space-y-4 p-6 pr-4 md:space-y-10 md:p-24">
			<h1 class="text-4xl font-semibold tracking-tight text-gray-400 md:text-6xl">Quintizer</h1>

			<div class="space-y-6">
				<Input
					label="AP News Link"
					placeholder="Enter AP News link..."
					bind:value={link}
					icon="ph:newspaper-clipping-thin" />
				<Button text="Fetch AP News" onclick={handleClick} disabled={loading} />
			</div>
		</div>
	{:else if title && body && quintTitles.length === 0}
		<div class="flex max-w-7xl flex-col space-y-4 p-4 md:space-y-10">
			<div class="space-y-6">
				<h1 class="text-3xl font-semibold tracking-tight text-gray-600 md:text-5xl">{title}</h1>
				<p class=" text-sm whitespace-pre-wrap text-gray-800 md:text-base">{body}</p>

				<Button text="Get Quintized" onclick={handleQuintization} disabled={loading} />
			</div>
		</div>
	{:else if quintTitles && quintStraplines && quintTitles.length > 0 && quintStraplines.length > 0}
		<div class="flex max-w-7xl flex-col space-y-6 p-4 md:space-y-10 md:p-12">
			<h1 class="text-4xl font-semibold tracking-tight text-gray-400 md:text-6xl">Quintized!</h1>

			<div class="space-y-2">
				<h1 class="text-xl font-semibold tracking-tight text-gray-600 md:text-2xl">Title(s)</h1>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each quintTitles as title}
						<div class="flex w-full items-center justify-start rounded-md bg-gray-100 px-4 py-2">
							<h1 class="mr-4 grow text-base font-semibold text-gray-800 md:text-lg">{title}</h1>

							<button
								title="Copy"
								class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 p-1 transition-colors duration-200 ease-in-out hover:border-gray-300 hover:bg-white"
								onclick={() => {
									handleCopy(title);
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-4 md:size-6"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									><path
										fill="currentColor"
										d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" /></svg>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<h1 class="text-xl font-semibold tracking-tight text-gray-600 md:text-2xl">Strapline(s)</h1>
				<div class="grid w-full grid-cols-1 gap-4">
					{#each quintStraplines as strapline}
						<div class="flex items-center justify-start space-x-4 rounded-md bg-gray-100 px-3 py-1">
							<h2 class="grow text-sm font-medium text-gray-700 md:text-base">{strapline}</h2>

							<button
								title="Copy"
								class="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-1 transition-colors duration-200 ease-in-out hover:border-gray-300 hover:bg-white"
								onclick={() => {
									handleCopy(strapline);
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-4"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									><path
										fill="currentColor"
										d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" /></svg>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<h1 class="text-xl font-semibold tracking-tight text-gray-600 md:text-2xl">Body</h1>
				<div class="grid w-full grid-cols-1 gap-4">
					{#each quintParagraphs as paragraph}
						<div class="flex items-center justify-start space-x-4 rounded-md bg-gray-100 p-2">
							<p class="grow text-sm font-medium text-gray-700 md:text-base">{paragraph}</p>

							<button
								title="Copy"
								class="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-1 transition-colors duration-200 ease-in-out hover:border-gray-300 hover:bg-white"
								onclick={() => {
									handleCopy(paragraph);
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-4"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									><path
										fill="currentColor"
										d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" /></svg>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<h1 class="text-xl font-semibold tracking-tight text-gray-600 md:text-2xl">Images</h1>
				<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
					{#each quintImages as image}
						<div
							class="flex flex-col items-center justify-center gap-4 rounded-md bg-gray-100 p-2 lg:flex-row lg:justify-start lg:space-x-4">
							<img
								src={image.url}
								alt={image.caption}
								class="h-24 w-24 grow rounded-md object-cover" />

							<h2 class="text-center text-sm font-medium text-gray-700 lg:text-left lg:text-base">
								{image.caption}
							</h2>
							<p class="text-sm text-gray-500">{image.attribution}</p>

							<button
								title="Copy"
								class="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-1 transition-colors duration-200 ease-in-out hover:border-gray-300 hover:bg-white"
								onclick={() => {
									handleCopy(image.caption);
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-4"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									><path
										fill="currentColor"
										d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" /></svg>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<h1 class="text-xl font-semibold tracking-tight text-gray-600 md:text-2xl">Tags</h1>
				<div class="flex flex-wrap items-center justify-start gap-4">
					{#each quintTags as tag}
						<button
							onclick={() => handleCopy(tag)}
							class="cursor-pointer rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200/80">
							{tag}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</main>
