import { jest, describe, test, expect, afterEach } from "@jest/globals";
import * as helper from "../../../helpers/isString.js";

afterEach(() => jest.restoreAllMocks());

describe("isString helper", () => {
    test("Returns true for string variables", () => {
        // Var
        const stringVar = "String var";

        // Mock
        const isStringSpy = jest.spyOn(helper, "default");

        // Test
        const result = helper.default(stringVar);
        expect(isStringSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(true);
    });

    test("Returns false for non-String variables", () => {
        // Var
        const testVariables = [
            null, undefined, false, 1, BigInt(1), Symbol("symbol"), {key: "val"}, ()=>true
        ];

        // Mock
        const isStringSpy = jest.spyOn(helper, "default");

        // Test
        testVariables.forEach((testVar, index) => {
            const result = helper.default(testVar);
            expect(isStringSpy).toHaveBeenCalledTimes(index+1);
            expect(result).toEqual(false);
        });
    });
});