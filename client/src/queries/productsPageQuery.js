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

// Temporary: fetch the entire raw document to debug field names
export const productsPageRawQuery = `*[_type == "productsPage"][0]`;
