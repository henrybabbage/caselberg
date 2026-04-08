<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import type { NavigationItem, SiteSettings } from '$lib/types/sanity';

	const defaultNav = [
		{ label: 'Clients', href: '/', isExternal: false },
		{ label: 'About', href: '/about', isExternal: false },
		{ label: 'Contact', href: '/contact', isExternal: false }
	] as const;

	function normalizeNavigation(items: NavigationItem[]): NavigationItem[] {
		return items.map((item) =>
			!item.isExternal && item.href === '/clients' ? { ...item, href: '/' } : item
		);
	}

	let { data, children } = $props<{
		data: { siteSettings: SiteSettings | null; logoUrl: string; aucklandTime: string };
		children: import('svelte').Snippet;
	}>();

	const siteName = $derived(data.siteSettings?.siteName ?? 'Caselberg Studio');
	const navigation = $derived(
		data.siteSettings?.navigation?.length
			? normalizeNavigation(data.siteSettings.navigation)
			: [...defaultNav]
	);
	const pathname = $derived(page.url.pathname);
	const isClients = $derived(pathname === '/' || pathname === '/clients');

	/** Absolute repo root for [sv-agentation](https://github.com/SikandarJODD/sv-agentation) “open in editor”. Set `PUBLIC_AGENTATION_WORKSPACE_ROOT` in `web/.env`. */
	const agentationWorkspaceRoot = $derived.by((): string | null => {
		const v = env.PUBLIC_AGENTATION_WORKSPACE_ROOT;
		return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
	});

	$effect(() => {
		if (!browser) return;
		const root = document.documentElement;
		if (isClients) root.classList.add('clients-no-scroll');
		else root.classList.remove('clients-no-scroll');
		return () => root.classList.remove('clients-no-scroll');
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="relative font-sans {isClients
		? 'flex h-dvh max-h-dvh flex-col overflow-hidden'
		: 'min-h-screen'}"
>
	<SiteHeader {siteName} logoUrl={data.logoUrl} {navigation} {pathname} />
	<main
		class="{isClients
			? 'flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24'
			: 'min-h-screen px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-24'}"
	>
		{@render children()}
	</main>
	<SiteFooter {siteName} initialAucklandTime={data.aucklandTime} />
</div>

{#if browser && dev}
	{#await import('sv-agentation') then mod}
		<mod.Agentation workspaceRoot={agentationWorkspaceRoot} />
	{/await}
{/if}
