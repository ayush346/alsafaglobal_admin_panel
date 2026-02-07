export default {
    name: 'productsPage',
    title: 'Products Page',
    type: 'document',
  
    fields: [
      // PRODUCT GROUPS
      {
        name: 'productGroups',
        title: 'Product Groups',
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
                    type: 'string',
                    title: 'Product Slug',
                    description: 'Enter the slug of a product from the products list above.'
                  }
                ],
                description: 'Select products to include in this group.'
              },
              {
                name: 'segmentRef',
                title: 'Link to Segment',
                type: 'reference',
                to: [{ type: 'segment' }],
                description: 'The "View Services" button for this group will link to this segment.'
              }
            ]
          }
        ]
      },
  
      // PAGE HEADER
      {
        name: 'title',
        title: 'Page Title',
        type: 'string'
      },
  
      {
        name: 'intro',
        title: 'Intro Paragraph',
        type: 'array',
        of: [{ type: 'block' }]
      },
  
      // PRODUCTS LIST
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
                name: 'title',
                title: 'Product Title',
                type: 'string'
              },
              {
                name: 'slug',
                title: 'URL Slug',
                type: 'string',
                description: 'Used in nav dropdown and section anchor (e.g. product-abc). Lowercase, hyphens only. Falls back to title if empty.'
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
                  options: {
                    hotspot: true
                  },
                  description: 'Upload an image for this product.'
                },
                {
                  name: 'segmentRef',
                  title: 'Link to Segment',
                  type: 'reference',
                  to: [{ type: 'segment' }],
                  description: 'Select a segment. The "View Services" button will navigate to this segment.'
                },

              {
                name: 'segmentLink',
                title: 'Target Segment URL (Deprecated)',
                type: 'string',
                description: '[Kept for backward compatibility] Use "Link to Segment" field instead.'
              }
  
            ]
          }
        ]
      }
  
    ]
  }
