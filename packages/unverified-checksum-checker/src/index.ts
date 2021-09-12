import { globby } from "globby";
import { collectExecutableCommands } from "@pkgdeps/checksum-collector";
import * as fs from "fs/promises";
export const verify = async (globList: string[]) => {
    const filePathsList = await globby(globList);
    const checkResults: string[] = [];
    for (const filePath of filePathsList) {
        const content = await fs.readFile(filePath, "utf-8");
        const commands = collectExecutableCommands(content);
        commands
            .filter((command) => command.checked)
            .forEach((command) => {
                checkResults.push(`${filePath}: ${command} is not verified`);
            });
    }
    return checkResults;
};
