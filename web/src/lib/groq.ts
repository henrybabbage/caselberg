export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  siteName,
  logo,
  defaultSeoTitle,
  defaultSeoDescription,
  defaultOgImage,
  navigation[]{ label, href, isExternal }
}`;

export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0]{
  title
}`;

/** Carousel slides: do not append `}[predicate]` directly — GROQ binds it to `image` (subscript). Filter in `mapSlides` instead. */
export const clientsPageQuery = `*[_type == "clientsPage" && _id == "clientsPage"][0]{
  title,
  carouselLabel,
  "slides": carouselSlides[]->{
    _id,
    "name": coalesce(name, title),
    description,
    image,
    imageMobile,
    imageTablet,
    imageObjectPosition,
    projectUrl
  }
}`;

export const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  body
}`;

export const contactPageQuery = `*[_type == "contactPage" && _id == "contactPage"][0]{
  heading,
  email,
  emailDisplay,
  instagramUrl,
  instagramHandle,
  phoneTel,
  phoneDisplay
}`;
