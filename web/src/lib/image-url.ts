import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { env as publicEnv } from '$env/dynamic/public';

export function urlForImage(source: SanityImageSource | undefined): string | undefined {
	const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID;
	if (!projectId || !source) return undefined;
	const builder = createImageUrlBuilder({
		projectId,
		dataset: publicEnv.PUBLIC_SANITY_DATASET || 'production'
	});
	return builder.image(source).auto('format').quality(85).url();
}
