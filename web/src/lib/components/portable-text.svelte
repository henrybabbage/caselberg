<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import type { PortableTextBlock } from '@portabletext/types';

	type Props = {
		value: PortableTextBlock[] | undefined;
		class?: string;
	};

	let { value, class: className = '' }: Props = $props();
</script>

{#if value?.length}
	<div class={`max-w-none leading-relaxed text-[#0a0a0a] ${className}`}>
		<PortableText value={value} />
	</div>
{/if}
