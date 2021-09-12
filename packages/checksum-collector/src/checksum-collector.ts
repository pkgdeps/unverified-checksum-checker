import * as path from "path";
// @ts-expect-error: no types
import sh from "mvdan-sh";
import StructuredSource from "structured-source";

export const CHECKSUM_COMMANDS = [
    "cksum",
    "shasum",
    "md5sum",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum"
];
export type ShellWordToken = {
    range: readonly [number, number];
    value: string;
};
export const tokenize = (shellText: string): ShellWordToken[] => {
    const syntax = sh.syntax;
    const parser = syntax.NewParser();
    const f = parser.Parse(shellText, "src.sh");
    const parts: ShellWordToken[] = [];
    // syntax.DebugPrint(f);
    syntax.Walk(f, function (node: any) {
        // TODO: mvdan-sh does not support node.OpEnd
        // https://github.com/myitcv/gopherjs/issues/26
        // if (syntax.NodeType(node) === "BinaryCmd") {
        // console.log(syntax.String(node.Op));
        // }
        const nodeType = syntax.NodeType(node);
        if (nodeType === "Word") {
            node.Parts.forEach((WordPart: any) => {
                const wordType = syntax.NodeType(WordPart);
                if (wordType == "DblQuoted" || wordType == "SglQuoted") {
                    const range = [WordPart.Left.Offset(), WordPart.Right.Offset() + 1] as [number, number];
                    parts.push({
                        value: shellText.slice(range[0], range[1]),
                        range
                    });
                } else if (wordType == "Lit") {
                    const range = [WordPart.ValuePos.Offset(), WordPart.ValueEnd.Offset()] as [number, number];
                    parts.push({
                        value: WordPart.Value,
                        range: range
                    });
                } else if (wordType == "ParamExp") {
                    const range = [WordPart.Dollar.Offset(), WordPart.Rbrace.Offset()] as [number, number];
                    parts.push({
                        value: shellText.slice(range[0], range[1] + 1),
                        range: range
                    });
                }
            });
        }
        return true;
    });
    return parts;
};

function* lineSeparator(text: string) {
    const lines = text.split("\n");
    let currentStatements: string[] = [];
    let currentLineNumber = 0;
    for (const line of lines) {
        currentStatements.push(line);
        if (/\\\s*$/.test(line)) {
            yield { line: line, statement: currentStatements.join("\n"), lineNumber: currentLineNumber };
            currentLineNumber++;
            continue;
        }
        yield { line: line, statement: currentStatements.join("\n"), lineNumber: currentLineNumber };
        currentStatements = [];
        currentLineNumber++;
    }
}

const memorize = <CB extends (arg: string) => unknown>(fn: CB): CB => {
    const cacheMap = new Map<unknown, unknown>();
    return ((proxyArg: string) => {
        const cache = cacheMap.get(proxyArg);
        if (cache) {
            return cache;
        }
        const ret = fn(proxyArg);
        cacheMap.set(proxyArg, ret);
        return ret;
    }) as CB;
};
export type ExecutableCommand = {
    statement: string;
    binary: string;
    range: readonly [number, number];
    checked: boolean;
    checkedCommand?: {
        binary: string;
        range: readonly [number, number];
        targetToken: ShellWordToken;
    };
};
export const collectExecutableCommands = (content: string): ExecutableCommand[] => {
    const source = new StructuredSource(content);
    const memorizedTokenize = memorize(tokenize);
    // collect chmod as executable commands
    const chmodList: ExecutableCommand[] = [];
    for (const { line, lineNumber } of lineSeparator(content)) {
        const absoluteIndex = source.positionToIndex({
            line: lineNumber,
            column: 0
        });
        const matches = line.matchAll(/(?<chmod>chmod .*?)(&|\||\\|$)/g);
        for (const match of matches) {
            const chmodStatement = match.groups?.chmod;
            if (!chmodStatement || match.index === undefined) {
                continue;
            }
            const range = [match.index + absoluteIndex, match.index + absoluteIndex + chmodStatement.length] as const;
            const argv = memorizedTokenize(chmodStatement);
            const isExecutable = argv.some((p) => {
                return p.value === "+x" || p.value === "755";
            });
            if (isExecutable) {
                const binaryName = path.basename(argv[argv.length - 1].value);
                chmodList.push({
                    range,
                    statement: chmodStatement,
                    binary: binaryName,
                    checked: false
                });
            }
        }
    }
    // check checksum commands
    for (const { statement, lineNumber } of lineSeparator(content)) {
        const absoluteIndex = source.positionToIndex({
            line: lineNumber,
            column: 0
        });
        const tokens = memorizedTokenize(statement);
        const checksumToken = tokens.find((token) => {
            return CHECKSUM_COMMANDS.includes(token.value);
        });
        if (checksumToken) {
            chmodList.forEach((chmod) => {
                const checkedToken = tokens.find((token) => token.value.includes(chmod.binary));
                if (checkedToken) {
                    chmod.checked = true;
                    chmod.checkedCommand = {
                        binary: checksumToken.value,
                        range: [checksumToken.range[0] + absoluteIndex, checksumToken.range[1] + absoluteIndex],
                        targetToken: {
                            ...checkedToken,
                            range: [checkedToken.range[0] + absoluteIndex, checkedToken.range[1] + absoluteIndex]
                        }
                    };
                }
            });
        }
    }
    return chmodList;
};
