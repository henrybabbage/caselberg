<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	// Raw markup so each letter <path> can be styled with fill-opacity (an <img> can't be).
	import logoMarkup from '../../../static/logo.svg?raw'

	let { siteName = 'Caselberg Studio' }: { siteName?: string } = $props()

	const STORAGE_KEY = 'caselberg:splash-seen'
	const FADE_MS = 900
	const HOLD_AFTER_MS = 900
	const EXIT_MS = 550

	let visible = $state(false)
	let filled = $state(false)
	let leaving = $state(false)

	let holdTimer: ReturnType<typeof setTimeout> | undefined
	let exitTimer: ReturnType<typeof setTimeout> | undefined
	let raf: number | undefined

	function dismiss() {
		leaving = true
		exitTimer = setTimeout(() => {
			visible = false
		}, EXIT_MS)
	}

	onMount(async () => {
		try {
			if (sessionStorage.getItem(STORAGE_KEY)) return
			sessionStorage.setItem(STORAGE_KEY, '1')
		} catch {
			// sessionStorage unavailable (e.g. privacy mode) — show once for this load.
		}

		visible = true
		await tick()

		// Trigger the fill fade-in on the next frame so the transition runs.
		raf = requestAnimationFrame(() => {
			filled = true
		})

		holdTimer = setTimeout(dismiss, FADE_MS + HOLD_AFTER_MS)
	})

	onDestroy(() => {
		if (holdTimer) clearTimeout(holdTimer)
		if (exitTimer) clearTimeout(exitTimer)
		if (raf) cancelAnimationFrame(raf)
	})
</script>

{#if visible}
	<div class="splash" class:leaving role="presentation" aria-hidden="true">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="splash__logo" class:filled aria-label={siteName} role="img">
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
	}

	/* Each shape's white fill fades in together — no outlines. */
	.splash__logo :global(path) {
		fill: #fff;
		fill-opacity: 0;
		stroke: none;
		transition: fill-opacity 0.9s ease;
	}

	.splash__logo.filled :global(path) {
		fill-opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.splash__logo :global(path) {
			fill-opacity: 1;
			transition: none;
		}
	}
</style>
