<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		href: string;
		alt?: boolean;
		active?: boolean;
		class?: string;
		children: Snippet;
		target?: string;
		rel?: string;
	};

	let {
		href,
		alt = false,
		active = false,
		class: className = '',
		children,
		target,
		rel
	}: Props = $props();
</script>

<a
	{href}
	{target}
	{rel}
	class="underline-link {className}"
	data-underline-link={alt || active ? 'alt' : true}
>
	{@render children()}
</a>
