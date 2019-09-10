export const DEK_D_VIEW_URL = (id: number) => {
  const _url = new URL("https://writer.dek-d.com/story/writer/view.php");
  _url.searchParams.append("id", id.toFixed(0));

  return _url;
};

export const DEK_D_CHAPTER_URL = (id: number, chapter: number) => {
  const _url = new URL("https://writer.dek-d.com/story/writer/viewlongc.php");
  _url.searchParams.append("id", id.toFixed(0));
  _url.searchParams.append("chapter", chapter.toFixed(0));

  return _url;
};
