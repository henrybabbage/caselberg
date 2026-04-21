export type CascadingSlide = {
	id: string;
	title: string;
	description: string;
	src: string;
	srcMobile?: string;
	srcTablet?: string;
	/** Passed to img as object-position when set (whitelist in mapSlides). */
	imageObjectPosition?: string;
};
