<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Quintomation | Automatic AP Summary for Quintype</title>
	<meta
		name="description"
		content="Quintomation is an automatic AP news summarizer built for Quintype. It fetches the latest AP news, summarizes it using an LLM, and generates SEO-friendly headlines and tags." />

	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
