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
      description: 'Each group is a big heading with multiple products. Clicking a group opens its detail page showing subcategories.',
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
              description: 'Used in the URL for this product group detail page (e.g. /products/office-it-products).',
              options: { source: 'title', maxLength: 96 },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'groupImage',
              title: 'Group Cover Image',
              type: 'image',
              description: 'Main image shown on the products listing page for this group.',
              options: { hotspot: true },
            },
            {
              name: 'groupDescription',
              title: 'Group Description',
              type: 'text',
              description: 'Short description shown on the products listing page.',
            },
            {
              name: 'subcategories',
              title: 'Subcategories',
              description: 'Subcategories shown on the product group detail page (e.g. IT Hardware, IT Peripherals).',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Subcategory Title', type: 'string' },
                    { name: 'image', title: 'Subcategory Image', type: 'image', options: { hotspot: true } },
                    { name: 'description', title: 'Subcategory Description', type: 'text' },
                  ],
                  preview: {
                    select: { title: 'title', media: 'image' },
                  },
                },
              ],
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
          preview: {
            select: { title: 'title', media: 'groupImage' },
          },
        },
      ],
    },
  ],
}
