import test from "ava";
import { HtmlParser } from "./HtmlParser";

test("parser value is a input value", t => {
  const parser = new HtmlParser("<h3>Hello world</h3>");
  t.is(parser.value, "<h3>Hello world</h3>");
});

test("parser value is empty value", t => {
  const parser = new HtmlParser("");
  t.is(parser.value, "");
});

test("parse simple html tag", t => {
  const parser = new HtmlParser("<h3>Hello <span>world</span></h3>");
  t.is(parser.query("h3").text(), "Hello world");
});

test("parse attribute from html tag", t => {
  const parser = new HtmlParser('<h3 class="name">Hello</h3>');
  t.is(parser.query("h3").attr()["class"], "name");
});
