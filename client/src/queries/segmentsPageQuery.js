export const segmentsPageQuery = `

  *[_type == "segmentsPage"][0]{

    title,
    intro,

    segments[]{
      enabled,
      title,
      slug,
      description,
      servicesTitle,
      services[]{
        text,
        enabled
      }
    },

    whyChoose{
      title,
      items[]{
        title,
        description,
        enabled
      }
    }

  }

`

