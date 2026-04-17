<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { browser, dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import type { NavigationItem, SiteSettings } from '$lib/types/sanity';
	import { gsap, CustomEase } from '$lib/gsap';

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

	if (browser) {
		CustomEase.create('osmo', '0.625, 0.05, 0, 1');
	}

	onNavigate((navigation) => {
		if (!browser) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (navigation.to?.url.pathname === (navigation.from?.url.pathname ?? page.url.pathname)) return;

		return new Promise((resolve) => {
			const transitionWrap = document.querySelector('[data-transition-wrap]');
			const transitionPanel = document.querySelector('[data-transition-panel]');
			const transitionLabel = document.querySelector('[data-transition-label]');
			const currentMain = document.querySelector('main');

			const tl = gsap.timeline();

			gsap.set(transitionWrap, { pointerEvents: 'all' });
			tl.set(transitionPanel, { autoAlpha: 1 }, 0);

			tl.fromTo(
				transitionPanel,
				{ yPercent: 0 },
				{ yPercent: -100, duration: 0.8, ease: 'osmo' },
				0
			);

			tl.fromTo(
				transitionLabel,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, duration: 0.4, ease: 'osmo' },
				0.2
			);

			tl.fromTo(
				currentMain,
				{ y: '0vh' },
				{ y: '-15vh', duration: 0.8, ease: 'osmo' },
				0
			);

			tl.call(() => {
				resolve();

				requestAnimationFrame(() => {
					const newMain = document.querySelector('main');
					const tl2 = gsap.timeline();

					tl2.fromTo(
						transitionPanel,
						{ yPercent: -100 },
						{ yPercent: -200, duration: 1, ease: 'osmo', overwrite: 'auto', immediateRender: false },
						0.45
					);

					tl2.set(transitionPanel, { autoAlpha: 0 }, '>');

					tl2.fromTo(
						transitionLabel,
						{ autoAlpha: 1 },
						{ autoAlpha: 0, duration: 0.4, ease: 'osmo', overwrite: 'auto', immediateRender: false },
						0.55
					);

					tl2.fromTo(
						newMain,
						{ y: '15vh' },
						{ y: '0vh', duration: 1, ease: 'osmo', clearProps: 'all', immediateRender: false },
						0.45
					);

					tl2.call(() => {
						gsap.set(transitionWrap, { pointerEvents: 'none' });
						gsap.set(transitionPanel, { yPercent: 0 });
					});
				});
			});
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div data-transition-wrap class="transition">
	<div data-transition-panel class="transition__panel" style="opacity: 0; visibility: hidden;">
		<div data-transition-label class="flex items-center justify-center" style="opacity: 0; visibility: hidden;">
			<img src={data.logoUrl} alt={siteName} class="block h-auto max-h-[30px] w-auto max-w-[200px] sm:max-h-[40px] sm:max-w-[300px]" />
		</div>
	</div>
</div>

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
