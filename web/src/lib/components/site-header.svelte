<script lang="ts">
	import type { NavigationItem } from '$lib/types/sanity';

	type Props = {
		siteName: string;
		logoUrl: string;
		navigation: NavigationItem[];
		pathname: string;
	};

	let { siteName, logoUrl, navigation, pathname }: Props = $props();

	function isActive(href: string): boolean {
		if (href === '/') return pathname === '/' || pathname === '';
		return pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

<!-- Matches Squarespace: .header-title-logo img { width: auto; max-width: 100%; max-height: 20px; } -->
<header
	class="pointer-events-none fixed inset-x-0 top-0 z-20 flex shrink-0 items-start justify-between px-5 pt-6 sm:px-8 sm:pt-8"
>
	<a
		href="/"
		class="pointer-events-auto inline-flex max-w-full shrink-0 opacity-100 transition-opacity hover:opacity-75"
	>
		<img
			src={logoUrl}
			alt={siteName}
			class="block h-auto max-h-[20px] w-auto max-w-full"
			width="1500"
			height="145"
			fetchpriority="high"
			loading="eager"
			decoding="async"
		/>
	</a>
	<nav aria-label="Main" class="pointer-events-auto flex flex-wrap justify-end gap-x-8 gap-y-2 text-[11px] font-normal leading-none tracking-[0.06em]">
		{#each navigation as item (item.href + item.label)}
			<a
				href={item.href}
				class="text-inherit no-underline transition-opacity hover:opacity-70 {isActive(item.href)
					? 'underline decoration-1 underline-offset-[6px]'
					: ''}"
				target={item.isExternal ? '_blank' : undefined}
				rel={item.isExternal ? 'noreferrer' : undefined}
			>
				{item.label}
			</a>
		{/each}
	</nav>
</header>
