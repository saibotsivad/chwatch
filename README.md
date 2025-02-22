# chwatch

Very simple CLI tool to cheaply watch files and run a command on changes.

This is basically a command line wrapper of [conduitry/cheap-watch](https://github.com/Conduitry/cheap-watch), meant to be used during development of simple libraries.

## Install

The normal ways:

```bash
npm install chwatch
```

Or just use it:

```bash
npx chwatch <ARGS>
```

## Using

The CLI takes any number of input strings as regex matchers, but the last one is the command to execute.

Example: watch for any `*.js` file changes in a `src` directory, and run `npm run build` if any change.

```bash
chwatch "src/.+\.js$" "npm run build"
```

Example: like the above example, but also watch `*.md` files in a `docs` directory.

```bash
chwatch "src/.+\.js$" "docs/.+\.md$" "npm run build"
```

It always executes in the context of whatever directory you run it in.

## License

Published and released under the [Very Open License](http://veryopenlicense.com).
