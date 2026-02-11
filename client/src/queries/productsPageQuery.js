export const productsPageQuery = `
*[_type == "productsPage"][0]{
  title,
  intro,
  productGroups[]{
    title,
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
}
`;
