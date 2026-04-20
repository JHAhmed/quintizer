<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Quintomation | Automatic AP Summary for Quintype</title>
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/" />
</svelte:head>

<section class="flex h-screen w-screen flex-col items-center justify-center p-8 md:p-16">
	<div
		class="relative flex h-full w-full flex-col items-center justify-center space-y-8 rounded-2xl bg-gray-50 p-8 md:p-16">
		<h1 class="tracking-tigher text-center text-xl font-medium md:text-2xl">
			Quintomation, <span class="text-gray-800 italic">by Jamal Haneef</span>.
		</h1>

		<a
			href="/quintizer"
			class="group inline-flex rounded-full border-2 bg-black px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-black/90 active:scale-99 md:px-6 md:py-3 md:text-base"
			>Quintizer

			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24 "
				class="my-auto ml-2 hidden transition-all duration-150 group-hover:translate-x-1 md:block md:size-6"
				><path
					fill="currentColor"
					d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z" /></svg>
		</a>
	</div>
</section>
