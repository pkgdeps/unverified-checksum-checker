# @pkgdeps/unverified-checksum-checker

Found unverified executable binary on your shellscript.

This tool help you to implement checksum check logics. 

## Features

- [secretlint](https://github.com/secretlint/secretlint) integration: [secretlint-rule-checksum](./packages/secretlint-rule-checksum)
- Node.js module: [checksum-collector](./packages/checksum-collector)

## Usage

### Using CLI

[@pkgdeps/unverified-checksum-checker](https://www.npmjs.com/package/@pkgdeps/unverified-checksum-checker) is a command line tool.

```sh
$ npx @pkgdeps/unverified-checksum-checker [file|glob]
```

For example, You can check "script/**/*.sh" files via next command.

```
$ npx @pkgdeps/unverified-checksum-checker "script/**/*.sh"
```

[@pkgdeps/unverified-checksum-checker](https://www.npmjs.com/package/@pkgdeps/unverified-checksum-checker) is a simple CLI.

If you want to get flexible configuration, please use [secretlint](https://github.com/secretlint/secretlint) integration.

### Using Secretlint

[@pkgdeps/secretlint-rule-checksum](https://www.npmjs.com/package/@pkgdeps/secretlint-rule-checksum) is a secretlint rule.
It integrates with [secretlint](https://github.com/secretlint/secretlint) and provide flexible configuration.

Install secretlint and the rule.

```
npm install secretlint @pkgdeps/secretlint-rule-checksum --save-dev
npx secretlint --init
```

Next configuration enable `@pkgdeps/secretlint-rule-checksum` in secretlint.

`.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@pkgdeps/secretlint-rule-checksum"
        }
    ]
}
```

For more details, see [secretlint-rule-checksum's README](./packages/secretlint-rule-checksum) and [secretlint](https://github.com/secretlint/secretlint) page.

### Using Node.js modules

[@pkgdeps/checksum-collector](./packages/checksum-collector) is core modules for this checker.

If you want to customize it, please see [@pkgdeps/checksum-collector](./packages/checksum-collector).

## Changelog

See [Releases page](https://github.com/pkgdeps/unverified-checksum-checker/releases).

## Running tests

Install devDependencies and Run `yarn test`:

    yarn install
    yarn test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/pkgdeps/unverified-checksum-checker/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- azu: [GitHub](https://github.com/azu), [Twitter](https://twitter.com/azu_re)

## License

MIT © azu
