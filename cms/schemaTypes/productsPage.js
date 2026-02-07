export default {
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'intro',
      title: 'Intro Paragraph',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'productGroups',
      title: 'Product Groups',
      description: 'Each group is a big heading with multiple products and a View Services button.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Group Title',
              type: 'string',
            },
            {
              name: 'products',
              title: 'Products in Group',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Product Name', type: 'string' },
                    { name: 'image', title: 'Product Image', type: 'image', options: { hotspot: true }, description: 'Upload an image for this product.' },
                    { name: 'description', title: 'Product Description', type: 'text' },
                  ],
                },
              ],
              description: 'Add products to this group.'
            },
            {
              name: 'segmentRef',
              title: 'Link to Segment',
              type: 'reference',
              to: [{ type: 'segment' }],
              description: 'The "View Services" button for this group will link to this segment.'
            },
          ],
        },
      ],
    },
  ],
}
