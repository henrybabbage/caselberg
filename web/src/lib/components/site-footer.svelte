<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		siteName?: string;
		locationLabel?: string;
		initialAucklandTime: string;
	};

	let {
		siteName = 'Caselberg Studio',
		locationLabel = 'Auckland',
		initialAucklandTime
	}: Props = $props();

	const year = new Date().getFullYear();

	let clock = $state('');

	$effect(() => {
		clock = initialAucklandTime;
	});

	function formatAucklandClock(): string {
		const now = new Date();
		const fmt = new Intl.DateTimeFormat('en-NZ', {
			timeZone: 'Pacific/Auckland',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
		return fmt.format(now);
	}

	onMount(() => {
		clock = formatAucklandClock();
		const id = window.setInterval(() => {
			clock = formatAucklandClock();
		}, 1000);
		return () => clearInterval(id);
	});
</script>

<footer
	class="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-between px-5 pb-6 sm:px-8 sm:pb-8"
>
	<p class="font-sans text-[10px] font-normal leading-none tracking-[0.04em] text-[#0a0a0a]">
		© {year}
		{siteName}
	</p>
	<p class="font-sans text-right text-[10px] font-normal leading-none tracking-[0.04em] text-[#0a0a0a] tabular-nums">
		{locationLabel}
		{clock} GMT+12
	</p>
</footer>
