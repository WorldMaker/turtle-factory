/// ES6 module source information
interface ModuleSource {
	source: string;
}

/// Turtle description
interface Turtle {
	/// A name can be useful to visitors of a zoo
	name?: string;
	/// An object-pattern this turtle matches against
	pattern: string | any;
	/// Examples of states zoo visitors may find this turtle in a zoo
	examples?: any[];
	/// View to import and call
	require: string;
}

/// The JSON description that produces a view
interface TurtleExhibit {
	/// A name can be useful to visitors of a zoo
	name?: string;
	/// An ordered list of turtles to see
	turtles: Turtle[];
}

declare var __moduleName: string; // ESM module name var in SystemJS

declare module System {
	export function normalize(name: string, referrer?: string): Promise<string>;
}

let normalPromise = System.normalize('object-parser', __moduleName);

export function translate(load: ModuleSource) {
	let exhibit: TurtleExhibit = JSON.parse(load.source);
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