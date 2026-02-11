export const productsPageQuery = `
*[_type == "productsPage"][0]{
  title,
  intro,
  productGroups[]{
    title,
    "slug": coalesce(slug.current, lower(title)),
    segmentSlug,
    groupDescription,
    groupImage{
      asset->{url}
    },
    subcategories[]{
      title,
      description,
      image{
        asset->{url}
      }
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

export const productGroupBySlugQuery = `
*[_type == "productsPage"][0].productGroups[slug.current == $slug || lower(title) == $slug][0]{
  title,
  "slug": coalesce(slug.current, lower(title)),
  segmentSlug,
  groupDescription,
  groupImage{
    asset->{url}
  },
  subcategories[]{
    title,
    description,
    image{
      asset->{url}
    }
  },
  products[]{
    name,
    description,
    image{
      asset->{url}
    }
  }
}
`;
