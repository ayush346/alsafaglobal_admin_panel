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
        "slug": slug.current,
        description,
        image{
          asset->{url}
        }
      }
    }
  }
}
`;

export const allItemsQuery = `
*[_type == "productsPage"][0]{
  productGroups[]{
    products[]{
      items[]{
        title,
        "slug": slug.current,
        description,
        image{ asset->{url} },
        brands[]{
          brandImage{ asset->{url} },
          showBrandImage,
          brandName,
          showBrandName,
          modelName,
          showModelName,
          specification,
          showSpecification,
          price,
          showPrice
        }
      }
    }
  }
}
`;
