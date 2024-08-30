const NUMBER_OF_WORDS = 4;


export const fuzzyIndex = (text: string) => {

    const m: Record<string, number> = {};

    // get array of X words
    let index = createIndex(text);

    const temp = [];

    // soundex everything
    for (const i of index) {
        temp.push(i.split(' ').map(
            (v: string) => soundex(v)
        ).join(' '));
    }
    index = temp;

    // get each iteration
    for (const phrase of index) {
        if (phrase) {
            let v = '';
            const t = phrase.split(' ');
            while (t.length > 0) {
                const r = t.shift();
                v += v ? ' ' + r : r;
                // increment for relevance
                m[v] = m[v] ? m[v] + 1 : 1;
            }
        }
    }
    return m;
};


const createIndex = (text: string) => {

    // regex matches any alphanumeric from any language and strips spaces
    const finalArray: string[] = [];

    const wordArray = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .replace(/ +/g, ' ')
        .trim()
        .split(' ');

    do {
        finalArray.push(
            wordArray.slice(0, NUMBER_OF_WORDS).join(' ')
        );
        wordArray.shift();

    } while (wordArray.length !== 0);

    return finalArray;
};


export function soundex(s: string): string {
    const a = s.toLowerCase().split("");
    const f = a.shift() as string;
    let r = "";
    const codes: Record<string, number | string> = {
        a: "",
        e: "",
        i: "",
        o: "",
        u: "",
        b: 1,
        f: 1,
        p: 1,
        v: 1,
        c: 2,
        g: 2,
        j: 2,
        k: 2,
        q: 2,
        s: 2,
        x: 2,
        z: 2,
        d: 3,
        t: 3,
        l: 4,
        m: 5,
        n: 5,
        r: 6,
    };
    r = f + a
        .map((v: string) => codes[v])
        .filter((v, i: number, b) =>
            i === 0 ? v !== codes[f] : v !== b[i - 1])
        .join("");
    return (r + "000").slice(0, 4).toUpperCase();
}