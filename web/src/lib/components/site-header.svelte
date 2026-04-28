<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import type { NavigationItem } from '$lib/types/sanity';
	import UnderlineLink from '$lib/components/underline-link.svelte';

	type Props = {
		siteName: string;
		logoUrl: string;
		navigation: NavigationItem[];
		pathname: string;
	};

	let { siteName, logoUrl, navigation, pathname }: Props = $props();

	const mobileNavId = 'mobile-main-nav-links';

	let menuOpen = $state(false);

	const navStatus = $derived(menuOpen ? 'active' : 'not-active');

	function isActive(href: string): boolean {
		if (href === '/') return pathname === '/' || pathname === '';
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	afterNavigate(() => {
		menuOpen = false;
	});

	$effect(() => {
		if (!browser) return;
		if (!menuOpen) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				menuOpen = false;
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		if (!browser) return;
		const root = document.documentElement;
		if (!menuOpen) return;
		const previousOverflow = root.style.overflow;
		root.style.overflow = 'hidden';
		return () => {
			root.style.overflow = previousOverflow;
		};
	});
</script>

<!--
	Matches Squarespace: .header-title-logo img { max-height: 20px }.
	Mobile: full-screen overlay menu (bold-nav pattern); md+: inline links.
-->
<div
	class="header-mobile-root max-md:block md:contents"
	data-navigation-status={navStatus}
>
	<header
		style:view-transition-name="site-header"
		class="pointer-events-none fixed inset-x-0 top-0 z-40 flex shrink-0 items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8"
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
		<button
			type="button"
			class="bold-nav-full__hamburger flex md:hidden"
			data-navigation-toggle="toggle"
			aria-expanded={menuOpen}
			aria-controls={mobileNavId}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={toggleMenu}
		>
			<span class="bold-nav-full__hamburger-bar"></span>
			<span class="bold-nav-full__hamburger-bar"></span>
			<span class="bold-nav-full__hamburger-bar"></span>
		</button>
		<nav
			aria-label="Main"
			class="pointer-events-auto hidden flex-wrap justify-end gap-x-8 gap-y-2 text-[11px] font-normal leading-none tracking-[0.06em] md:flex"
		>
			{#each navigation as item (item.href + item.label)}
				<UnderlineLink
					href={item.href}
					active={isActive(item.href)}
					target={item.isExternal ? '_blank' : undefined}
					rel={item.isExternal ? 'noreferrer' : undefined}
				>
					{item.label}
				</UnderlineLink>
			{/each}
		</nav>
	</header>
	<div class="bold-nav-full__tile" aria-hidden={!menuOpen} inert={!menuOpen}>
		<ul class="bold-nav-full__ul" id={mobileNavId}>
			{#each navigation as item, i (item.href + item.label)}
				<li class="bold-nav-full__li" style="--nav-i: {i};">
					<a
						href={item.href}
						class="bold-nav-full__link"
						class:is--current={isActive(item.href)}
						target={item.isExternal ? '_blank' : undefined}
						rel={item.isExternal ? 'noreferrer' : undefined}
						onclick={() => {
							menuOpen = false;
						}}
					>
						<span class="bold-nav-full__link-text">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.bold-nav-full__tile {
		pointer-events: none;
		background-color: #fff;
		z-index: 35;
		view-transition-name: mobile-nav;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		display: flex;
		position: fixed;
		inset: 0;
		transition: clip-path 1s cubic-bezier(0.9, 0, 0.1, 1);
		clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
		border: none;
		outline: none;
		box-shadow: none;
	}

	@media (min-width: 48rem) {
		.bold-nav-full__tile {
			display: none;
		}
	}

	.header-mobile-root[data-navigation-status='active'] .bold-nav-full__tile {
		pointer-events: auto;
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
	}

	.bold-nav-full__hamburger {
		--hamburger-icon-height: 16px;
		--hamburger-bar-width: calc(var(--hamburger-icon-height) * 2 / 3);
		--hamburger-bar-offset: calc((var(--hamburger-icon-height) - 1px) / 2);
		pointer-events: auto;
		color: #0a0a0a;
		cursor: pointer;
		background-color: transparent;
		justify-content: center;
		align-items: center;
		width: var(--hamburger-icon-height);
		height: var(--hamburger-icon-height);
		padding: 0;
		border: none;
		outline: none;
		position: relative;
		overflow: hidden;
	}

	.header-mobile-root[data-navigation-status='active'] .bold-nav-full__hamburger {
		color: #0a0a0a;
	}

	.bold-nav-full__hamburger .bold-nav-full__hamburger-bar {
		background-color: currentColor;
		width: var(--hamburger-bar-width);
		height: 1px;
		position: absolute;
		transform: translate(0, 0) rotate(0.001deg);
		transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
	}

	.bold-nav-full__hamburger .bold-nav-full__hamburger-bar:nth-child(1) {
		transform: translate(0, calc(-1 * var(--hamburger-bar-offset))) scale(1, 1)
			rotate(0.001deg);
	}

	.bold-nav-full__hamburger .bold-nav-full__hamburger-bar:nth-child(3) {
		transform: translate(0, var(--hamburger-bar-offset)) scale(1, 1) rotate(0.001deg);
	}

	@media (hover: hover) and (pointer: fine) {
		.bold-nav-full__hamburger:hover .bold-nav-full__hamburger-bar:nth-child(1) {
			transform: translate(0, calc(-1 * var(--hamburger-bar-offset))) scale(0.5, 1)
				rotate(0.001deg);
		}

		.bold-nav-full__hamburger:hover .bold-nav-full__hamburger-bar:nth-child(3) {
			transform: translate(0, var(--hamburger-bar-offset)) scale(0.5, 1) rotate(0.001deg);
		}
	}

	.header-mobile-root[data-navigation-status='active'] .bold-nav-full__hamburger-bar:nth-child(1) {
		transform: translate(0, 0) rotate(45deg) scale(1, 1);
	}

	.header-mobile-root[data-navigation-status='active'] .bold-nav-full__hamburger-bar:nth-child(2) {
		transform: translate(-150%, 0) rotate(0.001deg) scale(1, 1);
	}

	.header-mobile-root[data-navigation-status='active'] .bold-nav-full__hamburger-bar:nth-child(3) {
		transform: translate(0, 0) rotate(-45deg) scale(1, 1);
	}

	@media (hover: hover) and (pointer: fine) {
		.header-mobile-root[data-navigation-status='active']
			.bold-nav-full__hamburger:hover
			.bold-nav-full__hamburger-bar:nth-child(1) {
			transform: translate(0, 0) rotate(45deg) scale(0.7, 1);
		}

		.header-mobile-root[data-navigation-status='active']
			.bold-nav-full__hamburger:hover
			.bold-nav-full__hamburger-bar:nth-child(3) {
			transform: translate(0, 0) rotate(-45deg) scale(0.7, 1);
		}
	}

	.bold-nav-full__ul {
		flex-flow: column;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
	}

	.bold-nav-full__li {
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
		display: flex;
		position: relative;
		overflow: hidden;
		transition: opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1);
	}

	.bold-nav-full__link {
		color: #0a0a0a;
		letter-spacing: -0.04em;
		padding-left: 0.075em;
		padding-right: 0.075em;
		font-family: var(--font-sans), system-ui, sans-serif;
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
		text-decoration: none;
		transform: translateY(100%) rotate(5deg);
		transition: transform 0.75s cubic-bezier(0.7, 0, 0.3, 1);
		transition-delay: calc(0.2s - min(var(--nav-i, 0), 5) * 0.05s);
		border: none;
		outline: none;
	}

	.bold-nav-full__link.is--current {
		font-weight: 500;
	}

	.header-mobile-root[data-navigation-status='active'] .bold-nav-full__link {
		transform: translateY(0%) rotate(0.001deg);
		transition-delay: calc(0.3s + min(var(--nav-i, 0), 8) * 0.05s);
	}

	.bold-nav-full__link-text {
		text-shadow: 0 1.1em 0 currentColor;
		display: block;
		position: relative;
	}

	.bold-nav-full__ul:has(.bold-nav-full__li:hover) .bold-nav-full__li {
		opacity: 0.15;
	}

	.bold-nav-full__ul:has(.bold-nav-full__li:hover) .bold-nav-full__li:hover {
		opacity: 1;
	}

	.bold-nav-full__link .bold-nav-full__link-text {
		transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
		transform: translateY(0%) rotate(0.001deg);
	}

	@media (hover: hover) and (pointer: fine) {
		.bold-nav-full__link:hover .bold-nav-full__link-text {
			transform: translateY(-100%) rotate(0.001deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bold-nav-full__tile {
			transition-duration: 0.01ms;
		}

		.bold-nav-full__hamburger .bold-nav-full__hamburger-bar,
		.bold-nav-full__link,
		.bold-nav-full__link .bold-nav-full__link-text,
		.bold-nav-full__li {
			transition-duration: 0.01ms;
		}

		.header-mobile-root[data-navigation-status='active'] .bold-nav-full__link {
			transition-delay: 0s;
		}
	}
</style>
