export const productsPageQuery = `
*[_type == "productsPage"][0]{
  title,
  intro,
  productGroups[]{
    title,
    segmentRef->{
      _id,
      title,
      slug
    },
    products[]{
      name,
      description,
      image{
        asset->{url}
      }
    }
  }
}
`;
