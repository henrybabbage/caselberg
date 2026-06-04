import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { env as publicEnv } from '$env/dynamic/public';

type ImageUrlOptions = {
	width?: number;
	height?: number;
	quality?: number;
};

export function urlForImage(
	source: SanityImageSource | undefined,
	options: ImageUrlOptions = {}
): string | undefined {
	const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID;
	if (!projectId || !source) return undefined;
	const builder = createImageUrlBuilder({
		projectId,
		dataset: publicEnv.PUBLIC_SANITY_DATASET || 'production'
	});
	let image = builder.image(source).auto('format').quality(options.quality ?? 85);
	if (options.width) image = image.width(options.width);
	if (options.height) image = image.height(options.height);
	return image.url();
}
