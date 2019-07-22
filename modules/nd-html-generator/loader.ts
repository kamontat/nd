import { render } from "mustache";
export type TemplateType = "default" | "pastal";

export const templateLoader = (name: TemplateType, obj: any) => {
  const pjson = require(`./templates/${name}/package.json`);

  const novel = require(`./templates/${name}/novel.html`);
  const chapter = require(`./templates/${name}/chapter.html`);

  return {
    body: {
      novel: render(novel, obj),
      chapter: render(chapter, obj),
    },
    css: {
      name,
      version: pjson.cssVersion,
      novel: require(`./templates/${name}/novel.sass`),
      chapter: require(`./templates/${name}/chapter.sass`),
    },
    name: require(`./templates/${name}/package.json`).name,
    version: pjson.version,
  };
};
