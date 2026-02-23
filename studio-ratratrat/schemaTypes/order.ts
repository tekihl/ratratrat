import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        defineField({ name: 'stripeSessionId', type: 'string' }),
        defineField({ name: 'stripePaymentIntentId', type: 'string' }),
        defineField({ name: 'email', type: 'string' }),
        defineField({ name: 'amountTotal', type: 'number' }),
        defineField({ name: 'status', type: 'string', options: { list: ['paid', 'failed', 'refunded'] } }),
        defineField({
            name: 'items',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'productId', type: 'string' },
                    { name: 'title', type: 'string' },
                    { name: 'price', type: 'number' },
                    { name: 'qty', type: 'number' },
                ],
            }],
        }),
    ],
})
