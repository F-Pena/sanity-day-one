import {createClient} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

export const handler = documentEventHandler(async ({context, event}) => {
  try {
    await createClient({
      ...context.clientOptions,
      useCdn: false,
      apiVersion: '2026-02-27',
    })
      .patch(event.data._id)
      .setIfMissing({
        firstPublished: new Date().toISOString(),
      })
      .commit({dryRun: context.local})
    console.log(context.local ? 'Dry run:' : 'Updated:', `firstPublished set on ${event.data._id}`)
  } catch (error) {
    console.error(error)
  }
})