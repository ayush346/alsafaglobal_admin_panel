export const productsPageQuery = `
*[_type == "productsPage"][0]{
  title,
  intro,
  productGroups[]{
    title,
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
