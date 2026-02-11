export const productsPageQuery = `
*[_type == "productsPage"][0]{
  title,
  intro,
  productGroups[]{
    title,
    "slug": slug.current,
    segmentSlug
  }
}
`;

export const productGroupBySlugQuery = `
*[_type == "productsPage"][0].productGroups[slug.current == $slug][0]{
  title,
  "slug": slug.current,
  segmentSlug,
  products[]{
    name,
    description,
    image{
      asset->{url}
    },
    items[]{
      title,
      description,
      image{
        asset->{url}
      }
    }
  }
}
`;
