import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Al Safa Global CMS',

  projectId: '5d3fj7tm',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Page')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('Segments Page')
              .child(S.document().schemaType('segmentsPage').documentId('segmentsPage')),
            S.listItem()
              .title('Products Page')
              .child(S.document().schemaType('productsPage').documentId('productsPage')),
            S.listItem()
              .title('About Page')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Contact Page')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
