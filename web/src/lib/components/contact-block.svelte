<script lang="ts">
	type Props = {
		heading: string;
		email: string;
		emailDisplay?: string;
		instagramUrl: string;
		instagramHandle: string;
		phoneTel: string;
		phoneDisplay: string;
	};

	let {
		heading,
		email,
		emailDisplay = email,
		instagramUrl,
		instagramHandle,
		phoneTel,
		phoneDisplay
	}: Props = $props();

	const telHref = $derived(phoneTel.startsWith('tel:') ? phoneTel : `tel:${phoneTel}`);
</script>

<div
	class="cs-contact-block text-[12px] leading-[1.4] [font-family:inherit]"
	aria-label="Contact details"
>
	<div class="cs-contact-heading mb-10">
		<span class="cs-heading-text text-[12px] leading-[1.2]">{heading}</span>
	</div>
	<div class="cs-contact-list flex flex-col gap-[0.4rem]">
		<div class="cs-contact-row inline-flex items-baseline whitespace-nowrap">
			<span
				class="cs-label inline-block min-w-[80px] text-[10px] leading-none tracking-[0.02em] max-[640px]:min-w-[72px]"
			>
				Email
			</span>
			<span
				class="cs-value ml-6 text-[12px] leading-[1.1] max-[640px]:ml-4 [&_a]:text-inherit [&_a]:no-underline [&_a]:[font-size:inherit] [&_a]:[line-height:inherit] hover:[&_a]:underline"
			>
				<a href={`mailto:${email}`}>{emailDisplay}</a>
			</span>
		</div>
		<div class="cs-contact-row inline-flex items-baseline whitespace-nowrap">
			<span
				class="cs-label inline-block min-w-[80px] text-[10px] leading-none tracking-[0.02em] max-[640px]:min-w-[72px]"
			>
				Instagram
			</span>
			<span
				class="cs-value ml-6 text-[12px] leading-[1.1] max-[640px]:ml-4 [&_a]:text-inherit [&_a]:no-underline [&_a]:[font-size:inherit] [&_a]:[line-height:inherit] hover:[&_a]:underline"
			>
				<a href={instagramUrl} target="_blank" rel="noreferrer">{instagramHandle}</a>
			</span>
		</div>
		<div class="cs-contact-row inline-flex items-baseline whitespace-nowrap">
			<span
				class="cs-label inline-block min-w-[80px] text-[10px] leading-none tracking-[0.02em] max-[640px]:min-w-[72px]"
			>
				Mobile
			</span>
			<span
				class="cs-value ml-6 text-[12px] leading-[1.1] max-[640px]:ml-4 [&_a]:text-inherit [&_a]:no-underline [&_a]:[font-size:inherit] [&_a]:[line-height:inherit] hover:[&_a]:underline"
			>
				<a href={telHref}>{phoneDisplay}</a>
			</span>
		</div>
	</div>
</div>
