import { error, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/firebase-admin';
import { dev } from '$app/environment';
import { fuzzyIndex } from '$lib/fuzzy-index';


export const load = (async () => {

    const data = await adminDB.collection('_posts').get();

    // don't return actual vector, won't serialize
    const docs = data.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            text: data['text']
        };
    });

    return {
        docs
    };

}) satisfies PageServerLoad;


export const actions = {

    addPost: async ({ request }) => {

        // disabling in production to prevent spam
        // comment out this line to work correctly
        if (!dev) {
            return;
        }

        const { text } = Object.fromEntries(
            await request.formData()
        );

        if (!text || typeof text !== 'string') {
            error(401, 'Invalid Text Input!');
        }

        const indexArray = fuzzyIndex(text);

        await adminDB.collection('_posts').add({
            text,
            search: indexArray
        });
    }

} satisfies Actions;
