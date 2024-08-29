import { error, type Actions } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase-admin';
import { soundex } from '$lib/fuzzy-index';


export const actions = {

    searchPosts: async ({ request }) => {

        const { text } = Object.fromEntries(
            await request.formData()
        );

        if (!text || typeof text !== 'string') {
            error(401, 'Invalid Text Input!');
        }

        const searchText = text
            .split(' ')
            .map(v => soundex(v))
            .join(' ');

        const data = await adminDB
            .collection('_posts')
            .orderBy(`search.${searchText}`)
            .limit(5)
            .get();

        // don't return actual map, won't serialize
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
    }

} satisfies Actions;