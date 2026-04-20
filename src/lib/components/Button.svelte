<script>
	let { text = 'Button', disabled = false, onclick = () => {} } = $props();
</script>

<button
	class="
    cursor-pointer rounded-full border-2 border-black bg-white text-sm md:text-base px-3 py-1 md:px-6 md:py-2  font-medium tracking-tight transition-all duration-200 
    hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-xl active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
	{onclick}
	disabled={disabled}>
	{text}
</button>
