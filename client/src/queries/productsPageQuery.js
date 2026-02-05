export const productsPageQuery = `

  *[_type == "productsPage"][0]{

    heroTitle,
    intro,

    products[]{
      enabled,
      id,
      title,
      description,
      servicesTitle,
      services[]{
        text,
        enabled
      }
    }

  }

`
