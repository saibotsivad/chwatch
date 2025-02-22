const CheapWatch = require('cheap-watch')
const { spawn } = require('node:child_process')

const DEBOUNCE_GATE = 200
const WORKING_DIR = __dirname

let [ commandString, ...patternStrings ] = process.argv.slice(2).reverse()
patternStrings = patternStrings.reverse()

if (!commandString || !patternStrings.length) {
	console.error('Usage: chwatch "regex pattern" "command"')
	process.exit(1)
}

const command = commandString.split(' ')
const patterns = patternStrings.map(ps => new RegExp((ps)))

let timeout
let child
let pending

const execute = () => {
	child = spawn(
		command[0],
		command.slice(1),
		{ stdio: 'inherit', shell: true },
	)
	child.on('error', (error) => {
		console.error(`Error executing command: ${error.message}`)
	})
	child.on('exit', () => {
		child = null
		if (pending) {
			pending = false
			execute()
		}
	})
}

const watch = new CheapWatch({
	dir: WORKING_DIR,
	watch: true,
})

watch.on('+', ({ path }) => {
	if (patterns.find(pattern => path.match(pattern))) {
		console.log('Change detected:', path)
		if (child) {
			pending = true
		} else {
			clearTimeout(timeout)
			timeout = setTimeout(() => { execute() }, DEBOUNCE_GATE)
		}
	}
})

watch.init().then(() => {
	if (patterns.length === 1) console.log('Watching for changes matching', patterns[0])
	else {
		console.log('Watching for changes matching')
		for (const p of patterns) console.log('-', p)
	}
})
