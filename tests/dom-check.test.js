const sizeOf = require("image-size");
const { doms, INDEX, ABOUT, CONTACT } = require("./dom-check.js");

const docs = doms.map(dom => dom.window.document);

// since tests are expected to run synchronously, saving image info
const images = [];

// tests from previous assignment with about and contact pages added
test("<head> should have a <title>", () =>
  docs.forEach(doc => expect(doc.querySelector("title")).not.toBeNull()));

test("<head> should have a <meta> description element", () =>
  docs.forEach(doc =>
    expect(doc.querySelector("meta[name=description]")).not.toBeNull()
  ));

test("all HTML files should contain an <h1>, and only one <h1>", () =>
  docs.forEach(doc => expect(doc.querySelectorAll("h1").length).toBe(1)));

test("all HTML files should contain favicon information", () =>
  docs.forEach(doc =>
    expect(doc.querySelector("link[rel='shortcut icon']")).not.toBeNull()
  ));

/*****************
 *** new tests ***
 *****************/
// header and nav on all pages
test("all index.html files must contain a <header>", () =>
  docs.forEach(doc => expect(doc.querySelector("header")).not.toBeNull()));

test("all <header> elements must contain a <nav> element", () =>
  docs.forEach(doc => expect(doc.querySelector("header>nav")).not.toBeNull()));

test("menu items in header <nav> must be in an <ul>", () =>
  docs.forEach(doc =>
    expect(doc.querySelector("header>nav>ul")).not.toBeNull()
  ));

// main index.html tests
test("main index.html must contain a <main>", () =>
  expect(docs[INDEX].querySelector("main")).not.toBeNull());

test("<main> must contain two <article> elements", () => {
  const articles = docs[INDEX].querySelectorAll("article");
  expect(articles.length).toBeGreaterThanOrEqual(2);
});

test("each <article> must contain an <h2> and at least one <p>", () => {
  const articles = docs[INDEX].querySelectorAll("article");
  articles.forEach(article => {
    expect(article.querySelector("h2")).not.toBeNull();
    expect(article.querySelectorAll("p")).not.toBeNull();
  });
});

// aside and footer tests
test("main index.html must contain an <aside>", () =>
  expect(docs[INDEX].querySelector("aside")).not.toBeNull());

test("main index.html must contain a <footer>", () =>
  expect(docs[INDEX].querySelector("footer")).not.toBeNull());

test("text in the <aside> must inside a <p>", () =>
  expect(docs[INDEX].querySelector("aside > p")).not.toBeNull());

test("text in the <footer> must be inside a <p>", () =>
  expect(docs[INDEX].querySelector("footer > p")).not.toBeNull());

// figure and image tests
test("main index.html must contain one image inside a <figure>", () => {
  const figure = docs[INDEX].querySelector("figure");
  expect(figure).not.toBeNull();
  if (figure) {
    expect(figure.querySelector("img")).not.toBeNull();
  }
});

test("<figure> must have a <figcaption> associated with it", () =>
  expect(docs[INDEX].querySelector("figure > figcaption")).not.toBeNull());

test("image paths are all lowercase and contain no spaces", () => {
  // builds the image array used by the other image tests
  let imgs = [];
  docs.forEach(doc => {
    imgs = imgs.concat(Array.from(doc.querySelectorAll("img")));
  });

  // no uppercase or whitespace
  const regex = new RegExp(/[A-Z]|\s/);

  imgs.forEach(img => {
    const path = img.src.replace(/^..\//, "");
    const dimensions = sizeOf(path);
    images.push({ img: img, dimensions: dimensions, path: path });
    expect(regex.test(path)).toBe(false);
  });
});

test("images must be 900px wide or less", () =>
  images.forEach(img => expect(img.dimensions.width).toBeLessThanOrEqual(900)));

test("relative paths to images used, and images must be in the images directory", () => {
  const regex = new RegExp(/^images\//);
  images.forEach(image => {
    expect(regex.test(image.path)).toBe(true);
  });
});

test("<img> height and width attributes are set to image intrinsic width", () => {
  images.forEach(image => {
    expect(image.img.width).toBe(image.dimensions.width);
    expect(image.img.height).toBe(image.dimensions.height);
  });
});

// text-level semantics tests
test("main index.html uses at least one instance of <strong>", () =>
  expect(docs[INDEX].querySelector("strong")).not.toBeNull());

test("main index.html uses at least one instance of <em>", () =>
  expect(docs[INDEX].querySelector("em")).not.toBeNull());

// link tests will be performed by the HTML proofer Github action
