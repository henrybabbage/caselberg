<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	// Raw markup so the logo can be inlined and clip-revealed (an <img> would also work,
	// but inlining keeps the fill color in our control).
	import logoMarkup from '../../../static/logo.svg?raw'

	let { siteName = 'Caselberg Studio' }: { siteName?: string } = $props()

	const STORAGE_KEY = 'caselberg:splash-seen'
	const REVEAL_MS = 1100
	const HOLD_AFTER_MS = 800
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

		// Trigger the top-to-bottom reveal on the next frame so the transition runs.
		raf = requestAnimationFrame(() => {
			filled = true
		})

		holdTimer = setTimeout(dismiss, REVEAL_MS + HOLD_AFTER_MS)
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

	.splash__logo :global(path) {
		fill: #fff;
		stroke: none;
	}

	/* Reveal the solid white logo top-to-bottom, so each letter fills in gradually. */
	.splash__logo {
		clip-path: inset(0 0 100% 0);
		transition: clip-path 1.1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.splash__logo.filled {
		clip-path: inset(0 0 0 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.splash__logo {
			clip-path: none;
			transition: none;
		}
	}
</style>
