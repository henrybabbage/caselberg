import type { PortableTextBlock } from '@portabletext/types';

export type NavigationItem = {
	label: string;
	href: string;
	isExternal?: boolean;
};

export type SiteSettings = {
	siteName?: string;
	logo?: unknown;
	defaultSeoTitle?: string;
	defaultSeoDescription?: string;
	defaultOgImage?: unknown;
	navigation?: NavigationItem[];
};

export type HomePage = {
	title?: string;
	subtitle?: string;
	heroImage?: unknown;
};

export type ClientSlide = {
	_id: string;
	/** Carousel title line; GROQ uses coalesce(name, title) for older documents */
	name?: string;
	description?: string;
	image?: unknown;
	imageMobile?: unknown;
	imageTablet?: unknown;
	projectUrl?: string;
};

export type ClientsPage = {
	intro?: PortableTextBlock[];
	carouselLabel?: string;
	slides?: ClientSlide[];
};

export type AboutPage = {
	title?: string;
	body?: PortableTextBlock[];
};

export type ContactPage = {
	intro?: PortableTextBlock[];
	heading?: string;
	email?: string;
	emailDisplay?: string;
	instagramUrl?: string;
	instagramHandle?: string;
	phoneTel?: string;
	phoneDisplay?: string;
};
