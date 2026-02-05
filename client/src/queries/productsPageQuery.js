export const productsPageQuery = `

  *[_type == "productsPage"][0]{

    title,
    intro,

    products[]{
      enabled,
      title,
      slug,
      description
    }

  }

`
