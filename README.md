# turtle-factory

> Turtle (pure) view factory

Turtle Factory is a factory for "pure" views (inspired by
[this article on "Pure UI" design](http://rauchg.com/2015/pure-ui/)).
It is implemented as an ES6/SystemJS loader plugin that takes a declarative JSON pattern
matching description and translates it to a very simple and "pure" view function of the
form `export default function view(state)` for use in [Cycle.js](http://cycle.js.org), React,
or what have you.

A sub-view or "turtle" at the simplest is a `pattern` for
[object-pattern](https://github.com/xaviervia/object-pattern) and `require` module that
will be called if the pattern matches. This require module should
`export default view(state)`.

The Turtle Factory takes a JSON object (as an import source) containing a list of `turtles`
and builds a view that attempts to match the incoming `state` object to each `pattern`,
returning the result of the `require`d function.

## Cycle.js MVI View

The "pure" view returned by the Turtle Factory can be used as simply as a `map` over your
state observable:

```js
import turtleView from 'router.json!turtle-factory';

export default function view(state$) {
	return state$.map(turtleView);
}
```

## Why "Turtle Factory"?
 
1. I was worried that it would be slow.
2. Your view can be composed of turtles **all the way down**: the `require`d function of
   your turtle could be another `!turtle-factory` composed view. This sort of composition
   can be a powerful tool: a page router is a pattern match over a `path` property; a
   widget might be in a number of states based upon availability or type of data; etc. 