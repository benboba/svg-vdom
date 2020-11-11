import { parse, ITagNode } from '../src';

test('selector with finder', async () => {
    const svg = `<svg><g id="a"><rect/><g><rect/></g></g></svg>`;
    const dom = await parse(svg);
    const ga = dom.querySelector('#a') as ITagNode;
    const rect = dom.querySelectorAll('rect');
    const sonRect = ga.querySelectorAll('>rect');
    expect(rect.length).toBe(2);
    expect(sonRect.length).toBe(1);
    expect(sonRect[0] === rect[0]).toBeTruthy();
});
