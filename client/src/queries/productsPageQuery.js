export const productsPageQuery = `

  *[_type == "productsPage"][0]{

    heroTitle,
    intro,

    products[]{
      enabled,
      id,
      name,
      description,
      image,
      servicesTitle,
      services[]{
        text,
        enabled
      }
    }

  }

`
