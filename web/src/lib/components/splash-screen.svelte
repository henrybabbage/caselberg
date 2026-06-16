<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	// Raw markup so we can reach each letter <path> and animate it (an <img> can't be).
	import logoMarkup from '../../../static/logo.svg?raw'

	let { siteName = 'Caselberg Studio' }: { siteName?: string } = $props()

	const STORAGE_KEY = 'caselberg:splash-seen'
	const DRAW_MS = 1500
	const FILL_MS = 450
	const HOLD_AFTER_MS = 700
	const EXIT_MS = 550

	let visible = $state(false)
	let filled = $state(false)
	let leaving = $state(false)
	let reduceMotion = $state(false)

	let logoEl: HTMLDivElement | undefined = $state()

	let fillTimer: ReturnType<typeof setTimeout> | undefined
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

		const paths = logoEl?.querySelectorAll<SVGPathElement>('path') ?? []

		if (reduceMotion || paths.length === 0) {
			// No draw-on: show the solid logo, then hold and exit.
			filled = true
			holdTimer = setTimeout(dismiss, DRAW_MS + HOLD_AFTER_MS)
			return
		}

		// Prime every letter's outline as a fully "unwritten" dashed stroke.
		for (const path of paths) {
			const len = path.getTotalLength()
			path.style.strokeDasharray = `${len}`
			path.style.strokeDashoffset = `${len}`
		}
		// Force layout so the primed state is committed before we transition.
		void logoEl?.getBoundingClientRect()

		raf = requestAnimationFrame(() => {
			for (const path of paths) {
				path.style.transition = `stroke-dashoffset ${DRAW_MS}ms ease`
				path.style.strokeDashoffset = '0'
			}
		})

		// Once the outlines are drawn, fade the solid fill in.
		fillTimer = setTimeout(() => {
			filled = true
		}, DRAW_MS)

		holdTimer = setTimeout(dismiss, DRAW_MS + FILL_MS + HOLD_AFTER_MS)
	})

	onDestroy(() => {
		if (fillTimer) clearTimeout(fillTimer)
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
			bind:this={logoEl}
			class="splash__logo"
			class:filled
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

	/* Render each letter as a white outline that "draws" in, then fills. */
	.splash__logo :global(path) {
		fill: #fff;
		fill-opacity: 0;
		stroke: #fff;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: fill-opacity 0.45s ease;
	}

	.splash__logo.filled :global(path) {
		fill-opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.splash__logo :global(path) {
			fill-opacity: 1;
			stroke: none;
			transition: none;
		}
	}
</style>
