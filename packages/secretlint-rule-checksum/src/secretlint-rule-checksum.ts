import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { collectExecutableCommands } from "@pkgdeps/checksum-collector";

const isShellScript = (content: string): boolean => {
    return /^#!\/.*\/(sh|bash|zsh|tsh|)/.test(content);
};
export const messages = {
    FOUND_UNVERIFIED_BINARY: {
        en: (props: { binary: string }) => `found unverified binary: ${props.binary}`,
        ja: (props: { binary: string }) =>
            `チェックサムのチェックがされていないバイナリ(${props.binary})がみつかりました`
    }
};
const hasVerifiedComment = (text: string, binaryName: string) => {
    // # {binaryName} is verified
    const match = text.match(/#(.*?)verified/);
    if (match) {
        return match[1].includes(binaryName);
    }
    return match;
};
export type Options = {
    /**
     * Define allow binary name
     **/
    allowBinaryNames?: string[];
};
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@pkgdeps/secretlint-rule-checksum",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/pkgdeps/unverified-checksum-checker/blob/master/packages/secretlint-rule-checksum/README.md"
        }
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                if (!isShellScript(source.content)) {
                    return;
                }
                try {
                    const commands = collectExecutableCommands(source.content);
                    commands.forEach((command) => {
                        if (command.checked) {
                            return;
                        }
                        if (options.allowBinaryNames?.includes(command.binary)) {
                            return;
                        }
                        const currentLine = source.rangeToLocation(command.range);
                        const ignoreCommentRange = source.locationToRange({
                            start: {
                                line: currentLine.start.line - 1,
                                column: 0
                            },
                            end: {
                                line: currentLine.end.line + 1,
                                column: 0
                            }
                        });
                        const commentText = source.content.slice(ignoreCommentRange[0], ignoreCommentRange[1] + 1);
                        if (hasVerifiedComment(commentText, command.binary)) {
                            return;
                        }
                        context.report({
                            message: t("FOUND_UNVERIFIED_BINARY", {
                                binary: command.binary
                            }),
                            range: command.range
                        });
                    });
                } catch (error) {
                    console.error("parse error", error, source);
                }
            }
        };
    }
};
