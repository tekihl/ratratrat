import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
        defineField({ name: 'description', type: 'text' }),
        defineField({ name: 'price', title: 'Price (SEK)', type: 'number', validation: (r) => r.required().min(1) }),
        defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
        defineField({
            name: 'images',
            title: 'Image Gallery',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'status',
            type: 'string',
            initialValue: 'for_sale',
            options: { list: ['for_sale', 'reserved', 'sold'] },
            validation: (r) => r.required(),
        }),
        defineField({ name: 'reservedUntil', type: 'datetime' }),
    ],
})
