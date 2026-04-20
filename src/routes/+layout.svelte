<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Quintomation | Automatic AP Summary for Quintype</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
