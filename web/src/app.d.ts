// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_SANITY_PROJECT_ID?: string;
		PUBLIC_SANITY_DATASET?: string;
		PUBLIC_SANITY_API_VERSION?: string;
		[key: string]: string | undefined;
	};
}

declare module '$env/dynamic/private' {
	export const env: {
		SANITY_API_READ_TOKEN?: string;
		[key: string]: string | undefined;
	};
}

export {};
