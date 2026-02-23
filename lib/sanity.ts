import { createClient } from '@sanity/client'

export const sanityRead = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.SANITY_API_VERSION!,
    useCdn: false,
})

export const sanityWrite = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.SANITY_API_VERSION!,
    token: process.env.SANITY_WRITE_TOKEN!,
    useCdn: false,
})
