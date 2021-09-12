# @pkgdeps/secretlint-rule-checksum

secretlint rule that check if checking checksum.


## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-github

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@pkgdeps/secretlint-rule-checksum"
        }
    ]
}
```

## MessageIDs

### FOUND_UNVERIFIED_BINARY
> found unverified binary: ${props.binary}

You need to verify checksum of the executable binary.

This rule found a unverified binary.
Unverified binary is next definition.

- Do `chmod +x binary`
- And the binary is not verified by `checksum` command

This rule aims to found untrusted binary that is downloaded by `curl` or `wget`.
As a results, It will prevent Supply-chain attack via untrusted binary.

verify-checksum-cheatsheet helps you how to verify the binary.

- [pkgdeps/verify-checksum-cheatsheet: Checksum CheatSheet. You need to verify the checksum before executing the downloaded binary.](https://github.com/pkgdeps/verify-checksum-cheatsheet)

## Options

- `allowBinaryNames: string[]`
    - Allows a list of binary name
    - For example, `["git", "jq"]`

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Changelog

See [Releases page](https://github.com/pkgdeps/unverified-checksum-checker/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

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