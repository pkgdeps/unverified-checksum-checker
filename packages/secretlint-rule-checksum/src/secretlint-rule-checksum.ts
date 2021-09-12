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
                        context.report({
                            message: t("FOUND_UNVERIFIED_BINARY", {
                                binary: command.binary
                            }),
                            // @ts-expect-error: range wider
                            range: command.range
                        });
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        };
    }
};
export default creator;
