export const homePageQuery = `

  *[_type == "homePage"][0]{

    bannerImage{
      asset->{url},
      alt
    },

    heroTitle,
    heroSubtitle,
    brandColorStyle,
    introText,

    heroSideImage{
      asset->{url},
      alt
    },

    stats[]{
      number,
      label
    },

    aboutPreview{
      title,
      body,
      image{
        asset->{url},
        alt
      },
      highlights[]{
        title,
        enabled
      },
      tags,
      buttonLabel
    },

    segmentsPreview{
      title,
      subtitle,
      segments[]{
        icon,
        title,
        description,
        buttonLabel,
        buttonLink,
        enabled
      }
    },

    whyChoose{
      title,
      subtitle,
      features[]{
        title,
        description,
        enabled
      }
    },

    ctaSection{
      title,
      subtitle,
      primaryButton,
      secondaryButton,
      stats[]{
        number,
        label,
        enabled
      }
    },

    testimonials{
      title,
      subtitle,
      items[]{
        quote,
        name,
        designation,
        enabled
      }
    }

  }

`
