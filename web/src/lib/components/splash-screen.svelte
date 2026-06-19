<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	// Inline the logo markup so its paths inherit the white fill from CSS.
	import logoMarkup from '../../../static/logo.svg?raw'

	let { siteName = 'Caselberg Studio' }: { siteName?: string } = $props()

	const STORAGE_KEY = 'caselberg:splash-seen'
	const ENTER_MS = 700
	const HOLD_AFTER_MS = 700
	const EXIT_MS = 550

	let visible = $state(false)
	let entered = $state(false)
	let leaving = $state(false)
	let reduceMotion = $state(false)

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

		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		visible = true
		await tick()

		if (reduceMotion) {
			// No motion: show the logo immediately, then hold and exit.
			entered = true
			holdTimer = setTimeout(dismiss, HOLD_AFTER_MS)
			return
		}

		// Run the fade-in transition from the initial (hidden) state.
		raf = requestAnimationFrame(() => {
			entered = true
		})

		holdTimer = setTimeout(dismiss, ENTER_MS + HOLD_AFTER_MS)
	})

	onDestroy(() => {
		if (holdTimer) clearTimeout(holdTimer)
		if (exitTimer) clearTimeout(exitTimer)
		if (raf) cancelAnimationFrame(raf)
	})
</script>

{#if visible}
	<div
		class="splash"
		class:leaving
		role="presentation"
		aria-hidden="true"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div
			class="splash__logo"
			class:entered
			aria-label={siteName}
			role="img"
		>
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

	/* Fade the whole logo in with a subtle upward drift. */
	.splash__logo {
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 700ms ease,
			transform 700ms ease;
	}

	.splash__logo.entered {
		opacity: 1;
		transform: none;
	}

	.splash__logo :global(path) {
		fill: #fff;
	}

	@media (prefers-reduced-motion: reduce) {
		.splash__logo {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
