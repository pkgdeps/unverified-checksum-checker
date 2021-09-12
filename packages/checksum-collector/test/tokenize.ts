import assert from "assert";
import { tokenize } from "../src/checksum-collector";

describe("tokenize", function () {
    it("should return tokens", () => {
        assert.deepStrictEqual(
            tokenize(`echo "$v test" | echo 'test2' && test \\\ntest|cat read.md>/dev/null # comment`),
            [
                { value: "echo", range: [0, 4] },
                { value: '"$v test"', range: [5, 14] },
                { value: "echo", range: [17, 21] },
                { value: "'test2'", range: [22, 29] },
                { value: "test", range: [33, 37] },
                { value: "test", range: [40, 44] },
                { value: "cat", range: [45, 48] },
                { value: "read.md", range: [49, 56] },
                { value: "/dev/null", range: [57, 66] }
            ]
        );
    });
    it("tokenize variable without quote", () => {
        assert.deepStrictEqual(tokenize("chmod +x ${BIN_DIR}/conftest"), [
            { value: "chmod", range: [0, 5] },
            { value: "+x", range: [6, 8] },
            { value: "${BIN_DIR}", range: [9, 18] },
            { value: "/conftest", range: [19, 28] }
        ]);
    });
    it("tokenize checksum pipeline", () => {
        assert.deepStrictEqual(
            tokenize(
                `grep -e "jq-linux64$" jq.sha256sum | shasum --check - || (echo "Error: Not match jq SHA256." && exit 1)`
            ),
            [
                { value: "grep", range: [0, 4] },
                { value: "-e", range: [5, 7] },
                { value: '"jq-linux64$"', range: [8, 21] },
                { value: "jq.sha256sum", range: [22, 34] },
                { value: "shasum", range: [37, 43] },
                { value: "--check", range: [44, 51] },
                { value: "-", range: [52, 53] },
                { value: "echo", range: [58, 62] },
                { value: '"Error: Not match jq SHA256."', range: [63, 92] },
                { value: "exit", range: [96, 100] },
                { value: "1", range: [101, 102] }
            ]
        );
    });
});
