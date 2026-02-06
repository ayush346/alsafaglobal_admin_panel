export default {
    name: 'segmentsPage',
    title: 'Segments Page',
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
  
  
  
      // SEGMENTS LIST
      {
        name: 'segments',
        title: 'Business Segments',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'enabled',
                title: 'Show This Segment',
                type: 'boolean',
                initialValue: true
              },
              {
                name: 'segmentRef',
                title: 'Segment',
                type: 'reference',
                to: [{ type: 'segment' }],
                description: 'Select a segment to include on this page.'
              }
            ]
          }
        ]
      },
      {
        name: 'whyChoose',
        title: 'Why Choose Us Section',
        type: 'object',
      
        fields: [
      
          {
            name: 'title',
            title: 'Section Title',
            type: 'string'
          },
      
          {
            name: 'items',
            title: 'Reasons List',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  { name: 'title', title: 'Reason Title', type: 'string' },
                  { name: 'description', title: 'Reason Description', type: 'text' },
                  { name: 'enabled', title: 'Show This Item', type: 'boolean', initialValue: true }
                ]
              }
            ]
          }
        ]
      }
      

    ]
  }
  