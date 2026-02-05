export default {
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',

  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Page hero title. Defaults to "Al Safa Global Products" if empty.'
    },
    {
      name: 'intro',
      title: 'Intro Paragraph',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'enabled',
              title: 'Show This Product',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'id',
              title: 'Product ID (anchor)',
              type: 'string',
              description: 'Used as the section anchor and nav hash (e.g. product-abc). If empty a slugified title will be used.'
            },
            {
              name: 'name',
              title: 'Product Name',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Short Description',
              type: 'text'
            },
            {
              name: 'image',
              title: 'Product Image',
              type: 'image',
              options: { hotspot: true }
            },
            {
              name: 'servicesTitle',
              title: 'Services Section Heading',
              type: 'string',
              initialValue: 'Our Products & Services Include:'
            },
            {
              name: 'services',
              title: 'Services List',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'text', title: 'Service Item', type: 'string' },
                    { name: 'enabled', title: 'Show This Item', type: 'boolean', initialValue: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]

}
