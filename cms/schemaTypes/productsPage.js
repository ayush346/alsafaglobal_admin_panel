export default {
    name: 'productsPage',
    title: 'Products Page',
    type: 'document',
  
    fields: [
  
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
              }
              ,
              {
                name: 'segmentLink',
                title: 'Target Segment URL',
                type: 'string',
                 description: 'Enter the segment URL slug (e.g., office-construction, oil-gas, aviation-marine). Matches the "URL Slug" field in Segments page.'
              }
  
            ]
          }
        ]
      }
  
    ]
  }
