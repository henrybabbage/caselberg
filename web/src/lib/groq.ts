export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  siteName,
  logo,
  defaultSeoTitle,
  defaultSeoDescription,
  defaultOgImage,
  navigation[]{ label, href, isExternal }
}`;

export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0]{
  title,
  subtitle,
  heroImage
}`;

export const clientsPageQuery = `*[_type == "clientsPage" && _id == "clientsPage"][0]{
  intro,
  carouselLabel,
  "slides": carouselSlides[]->{
    _id,
    "name": coalesce(name, title),
    description,
    image,
    imageMobile,
    imageTablet,
    projectUrl
  }[defined(_id) && defined(image.asset)]
}`;

export const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  body
}`;

export const contactPageQuery = `*[_type == "contactPage" && _id == "contactPage"][0]{
  intro,
  heading,
  email,
  emailDisplay,
  instagramUrl,
  instagramHandle,
  phoneTel,
  phoneDisplay
}`;
