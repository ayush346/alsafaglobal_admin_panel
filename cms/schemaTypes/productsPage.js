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
              name: 'slug',
              title: 'URL Slug',
              type: 'slug',
              description: 'URL-friendly identifier for the detail page. Click Generate.',
              options: { source: 'title', maxLength: 96 },
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
              name: 'detailItems',
              title: 'Detail Page Items',
              description: 'Items shown when user clicks into this group (e.g. Desktop computers, Laptops, Servers). Each has an image, title, and description.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Item Title', type: 'string' },
                    { name: 'image', title: 'Item Image', type: 'image', options: { hotspot: true } },
                    { name: 'description', title: 'Item Description', type: 'text' },
                  ],
                  preview: {
                    select: { title: 'title', media: 'image' },
                  },
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
