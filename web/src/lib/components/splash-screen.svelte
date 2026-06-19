<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	import { gsap } from 'gsap'
	// Raw markup so the logo is inlined and each letter <path> can be transformed
	// individually (an <img> can't be styled per-shape).
	import logoMarkup from '../../../static/logo.svg?raw'

	let { siteName = 'Caselberg Studio' }: { siteName?: string } = $props()

	const STORAGE_KEY = 'caselberg:splash-seen'
	// How far below its resting position the logo starts before rising into place.
	// Deliberately tiny so the motion is barely perceptible — a settle, not a slide.
	const RISE_OFFSET = 4

	let visible = $state(false)
	let splashEl: HTMLDivElement | undefined
	let logoEl: HTMLDivElement | undefined

	let ctx: gsap.Context | undefined

	function removeBackdrop() {
		if (typeof document === 'undefined') return
		document.getElementById('splash-backdrop')?.remove()
	}

	function unmount() {
		visible = false
	}

	onMount(async () => {
		let seen = false
		try {
			seen = Boolean(sessionStorage.getItem(STORAGE_KEY))
			if (!seen) sessionStorage.setItem(STORAGE_KEY, '1')
		} catch {
			// sessionStorage unavailable (e.g. privacy mode) — show once for this load.
		}

		if (seen) {
			// The inline app.html script normally already removed it; this is a safety net.
			removeBackdrop()
			return
		}

		const reduce =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches

		// The component (z-index 100) renders the same red as the backdrop (z-index 90),
		// so it overlays seamlessly before we hand off.
		visible = true
		await tick()

		if (!splashEl || !logoEl) return

		// gsap.context tracks every tween created inside it so onDestroy can revert
		// them and clean up inline styles even if we leave mid-animation.
		ctx = gsap.context(() => {
			if (reduce) {
				gsap.set(logoEl!, { autoAlpha: 1 })
				removeBackdrop()
				gsap.to(splashEl!, {
					autoAlpha: 0,
					duration: 0.4,
					delay: 1.2,
					onComplete: unmount
				})
				return
			}

			// Starting state: word hidden and nudged slightly below its resting spot.
			gsap.set(logoEl!, { autoAlpha: 0, y: RISE_OFFSET })

			removeBackdrop()

			gsap
				.timeline({ onComplete: unmount })
				// Word fades in while rising gently into place.
				.to(logoEl!, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 0)
				// Hold, then fade the whole splash away to reveal the page.
				.to(splashEl!, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.6')
		}, splashEl)
	})

	onDestroy(() => {
		ctx?.revert()
	})
</script>

{#if visible}
	<div class="splash" bind:this={splashEl} role="presentation" aria-hidden="true">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="splash__logo" bind:this={logoEl} aria-label={siteName} role="img">
			{@html logoMarkup}
		</div>
	</div>
{/if}

<style>
	.splash {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: 1.5rem;
		background: #d40f0f;
	}

	.splash__logo :global(svg) {
		display: block;
		width: min(70vw, 520px);
		height: auto;
		/* Allow the spread letters to extend past the viewBox without being clipped. */
		overflow: visible;
	}

	/* Hidden until GSAP fades it in, so there's no flash before the timeline runs. */
	.splash__logo {
		opacity: 0;
	}

	.splash__logo :global(path) {
		fill: #fff;
		stroke: none;
	}
</style>
