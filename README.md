# @surimi/selector-parser

A zero-dependency CSS selector parser - written in typescript types.

Convert a valid CSS selector into an AST-like structure, both at runtime and in typescript types.

```css
html#container.button > .icon
```

becomes something like

```json
{
  "type": "complex",
  "combinator": ">",
  "left": {
    "type": "compound",
    "list": [
      {
        "name": "html",
        "type": "type",
        "content": "html"
      },
      {
        "name": "container",
        "type": "id",
        "content": "#container"
      },
      {
        "name": "button",
        "type": "class",
        "content": ".button"
      }
    ]
  },
  "right": {
    "name": "icon",
    "type": "class",
    "content": ".icon"
  }
}
```

This is heavily inspired by, and partially includes code derived from, https://parsel.verou.me by the one and only [Lea Verou](https://github.com/sponsors/LeaVerou).
