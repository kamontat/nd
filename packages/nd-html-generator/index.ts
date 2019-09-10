import TemplateType from "./constants/TemplateType";
import Generator from "./models/Generator";
import Package from "./package.json";

// Usage:

// const generator = new Generator({
//   auth: { name: "name", username: "username", expireat: 123123123, issueat: 123123124 },
//   contents: [],
//   novel: {
//     abstract: "novel abstract",
//     author: "someone",
//     chapters: [],
//     description: "novel description",
//     downloadat: 1231231236,
//     id: 1234567,
//     link: "https://google.com",
//     size: 0,
//     tags: [],
//     updateat: 1231231239,
//     title: "novel title",
//   },
// });

// const html = generator.load(TemplateType.Default);
// console.log(html);

export { Package, TemplateType, Generator };

export { IConfigObject } from "./constants/Object";
