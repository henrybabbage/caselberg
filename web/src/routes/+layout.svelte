<script lang="ts">
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import type { SiteSettings } from '$lib/types/sanity';

	const defaultNav = [
		{ label: 'Clients', href: '/clients', isExternal: false },
		{ label: 'About', href: '/about', isExternal: false },
		{ label: 'Contact', href: '/contact', isExternal: false }
	] as const;

	let { data, children } = $props<{
		data: { siteSettings: SiteSettings | null; logoUrl: string; aucklandTime: string };
		children: import('svelte').Snippet;
	}>();

	const siteName = $derived(data.siteSettings?.siteName ?? 'Caselberg Studio');
	const navigation = $derived(
		data.siteSettings?.navigation?.length ? data.siteSettings.navigation : [...defaultNav]
	);
	const pathname = $derived(page.url.pathname);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="relative min-h-screen font-sans">
	<SiteHeader {siteName} logoUrl={data.logoUrl} {navigation} {pathname} />
	<main class="min-h-screen px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-24">
		{@render children()}
	</main>
	<SiteFooter {siteName} initialAucklandTime={data.aucklandTime} />
</div>
