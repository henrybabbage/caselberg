<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	// Raw markup so the logo is inlined and each letter <path> can be transformed
	// individually (an <img> can't be styled per-shape).
	import logoMarkup from '../../../static/logo.svg?raw'

	let { siteName = 'Caselberg Studio' }: { siteName?: string } = $props()

	const STORAGE_KEY = 'caselberg:splash-seen'
	const REVEAL_MS = 1100
	const HOLD_AFTER_MS = 700
	const EXIT_MS = 550
	// Duration of the letters gathering from their spread positions to home.
	const GATHER_MS = 1000
	// Initial extra letter spacing as a fraction of each glyph's distance from the
	// wordmark centre. The letters start spread apart and gather to their real
	// positions while the word fades in.
	const SPREAD_FACTOR = 0.1

	let visible = $state(false)
	let filled = $state(false)
	let leaving = $state(false)
	let logoEl: HTMLDivElement | undefined

	let holdTimer: ReturnType<typeof setTimeout> | undefined
	let exitTimer: ReturnType<typeof setTimeout> | undefined

	function removeBackdrop() {
		if (typeof document === 'undefined') return
		document.getElementById('splash-backdrop')?.remove()
	}

	function dismiss() {
		leaving = true
		exitTimer = setTimeout(() => {
			visible = false
		}, EXIT_MS)
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

		const paths = logoEl ? Array.from(logoEl.querySelectorAll('path')) : []

		if (reduce) {
			filled = true
			removeBackdrop()
			holdTimer = setTimeout(dismiss, HOLD_AFTER_MS)
			return
		}

		// Each glyph's spread offset is based on its real horizontal position, so the
		// gather reads correctly regardless of the order paths appear in the file.
		const glyphs = paths.map((p) => {
			const box = p.getBBox()
			return { p, center: box.x + box.width / 2 }
		})

		removeBackdrop()
		// Fades the whole word in (opacity transition lives on the container div).
		filled = true

		// Animate the gap from wide to normal. CSS transitions don't animate `transform`
		// on SVG <path> elements, so drive the gather with the Web Animations API.
		if (glyphs.length) {
			const centers = glyphs.map((g) => g.center)
			const wordCenter = (Math.min(...centers) + Math.max(...centers)) / 2
			for (const { p, center } of glyphs) {
				const offset = (center - wordCenter) * SPREAD_FACTOR
				p.animate(
					[{ transform: `translateX(${offset}px)` }, { transform: 'translateX(0)' }],
					{ duration: GATHER_MS, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
				)
			}
		}

		holdTimer = setTimeout(dismiss, REVEAL_MS + HOLD_AFTER_MS)
	})

	onDestroy(() => {
		if (holdTimer) clearTimeout(holdTimer)
		if (exitTimer) clearTimeout(exitTimer)
	})
</script>

{#if visible}
	<div class="splash" class:leaving role="presentation" aria-hidden="true">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="splash__logo" class:filled bind:this={logoEl} aria-label={siteName} role="img">
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
		opacity: 1;
		transition: opacity 0.55s ease;
	}

	.splash.leaving {
		opacity: 0;
	}

	.splash__logo :global(svg) {
		display: block;
		width: min(70vw, 520px);
		height: auto;
		/* Allow the spread letters to extend past the viewBox without being clipped. */
		overflow: visible;
	}

	/* The whole word fades in together. */
	.splash__logo {
		opacity: 0;
		transition: opacity 0.9s ease;
	}

	.splash__logo.filled {
		opacity: 1;
	}

	/* The gather (transform) is driven by the Web Animations API in JS, because CSS
	   transitions don't animate `transform` on SVG <path> elements. */
	.splash__logo :global(path) {
		fill: #fff;
		stroke: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.splash__logo,
		.splash__logo :global(path) {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
