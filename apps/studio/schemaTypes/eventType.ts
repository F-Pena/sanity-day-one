import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import { DoorsOpenInput } from '../structure/DoorsOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
    defineField({
        name: 'slug',
        type: 'slug',
        options: {
            source: 'name'
        },
        group: 'details',
        validation: (rule) => rule.required().error('Required to generate a page on the website'),
        hidden: ({document}) => !document?.name,
        readOnly: ({value, currentUser}) => {
            if(!value) {
                return false
            }

            const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

            return !isAdmin
        }
    }),
    defineField({
        name: 'eventType',
        type: 'string',
        deprecated:{
            reason: 'Use the format field instead',
        },
        readOnly: true,
        options: {
            list: ['in-person', 'virtual'],
            layout: 'radio',
        },
        group: 'details',
        hidden: true,
    }),
    defineField({
        name: 'format',
        type: 'string',
        options: {
            list: ['in-person', 'virtual'],
            layout: 'radio',
        },
        group: 'details',
        validation: (rule) => rule.required()
    }),
    defineField({
        name: 'date',
        type: 'datetime',
        group: 'details',
    }),
    defineField({
        name: 'doorsOpen',
        type: 'number',
        initialValue: 60,
        description: 'Number of minutes before the start time for admission',
        group: 'details',
        components: {
            input: DoorsOpenInput,
        }
    }),
    defineField({
        name: 'venue',
        type: 'reference',
        to: [{type: 'venue'}],
        validation: (rule) => rule.custom((value, context) => {
            if(value && context?.document?.eventType === 'virtual') {
                console.log('Only in-person events can have a venue')
                return 'Only in-person events can have a venue'
            }

            return true
        }),
        readOnly: ({value, document}) => !value && document?.eventType === 'virtual',
        group: 'details',
    }),
    defineField({
        name: 'headline',
        group: 'editorial',
        type: 'reference',
        to: [{type: 'artist'}],
    }),
    defineField({
        name: 'image',
        type: 'image',
        group: 'editorial',
    }),
    defineField({
        name: 'details',
        type: 'array',
        of: [{type: 'block'}],
        group: 'editorial',
    }),
    defineField({
        name: 'tickets',
        type: 'url',
        group: 'editorial',
    }),
    defineField({
        name: 'firstPublished',
        description: 'Automatically set when first published',
        type: 'datetime',
        readOnly: true,
      })  
  ],
  preview: {
    select: {
        name: 'name',
        venue: 'venue.name',
        date: 'date',
        artist: 'headline.name',
        image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
        const nameFormatted = name || 'Untitled event'
        const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            })
        : ''

        return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
        media: image || CalendarIcon,
        }
    },
  }
})