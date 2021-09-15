import { snapshot } from "@secretlint/tester";
import path from "path";
import { creator as rule } from "../src/secretlint-rule-checksum.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
describe("@pkgdeps/secretlint-rule-checksum", () => {
    snapshot({
        defaultConfig: {
            rules: [
                {
                    id: pkg.name,
                    rule,
                    options: {}
                }
            ]
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: path.join(__dirname, "snapshots")
    }).forEach((name, test) => {
        it(name, async function () {
            const status = await test();
            if (status === "skip") {
                this.skip();
            }
        });
    });
});
