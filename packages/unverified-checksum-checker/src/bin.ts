import meow from "meow";
import { verify } from "./index";

export const cli = meow(
    `
    Usage
      $ npx @pkgdeps/unverified-checksum-checker [file|glob]
 
    Options

    Examples
      $ npx @pkgdeps/unverified-checksum-checker "script/**/*.sh"
`,
    {
        flags: {},
        autoHelp: true,
        autoVersion: true,
        importMeta: import.meta
    }
);

export const run = async (input = cli.input, _flags = cli.flags) => {
    const checkResults = await verify(input);
    if (checkResults.length === 0) {
        process.exitCode = 0;
        return;
    }
    process.exitCode = 1;
    console.error(checkResults.join("\n"));
};

run().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});
