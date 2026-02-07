import { SegmentSelector } from '../components/SegmentSelector'

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
      description: 'Each group is a big heading with multiple products.',
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
                    { name: 'image', title: 'Product Image', type: 'image', options: { hotspot: true } },
                    { name: 'description', title: 'Product Description', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'segmentSlug',
              title: 'Link to Segment',
              type: 'string',
              description: 'Select the segment this group\'s "View Services" button links to.',
              components: { input: SegmentSelector },
            },
          ],
        },
      ],
    },
  ],
}
