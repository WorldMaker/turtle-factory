let normalPromise = System.normalize('object-parser', __moduleName);
export function translate(load) {
    let exhibit = JSON.parse(load.source);
    let imports = exhibit.turtles
        .map((turtle, i) => `import turtle${i} from "${turtle.require}";`)
        .join('\n');
    let patterns = exhibit.turtles
        .map((turtle, i) => `let pattern${i} = parse(${JSON.stringify(turtle.pattern)});`)
        .join('\n');
    let runs = exhibit.turtles
        .map((turtle, i) => `
			/* ${turtle.name} */
			if (pattern${i}.match(state)) { return turtle${i}(state); }
		`)
        .join('\n');
    return normalPromise.then(objectParserPath => `
		import {parse} from '${objectParserPath}';
		${imports}
		${patterns}
		export default view(state) {
			${runs}
		}
	`);
}
//# sourceMappingURL=turtle.js.map