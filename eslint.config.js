import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import { parse, parseForESLint } from "@typescript-eslint/parser";
import * as importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";

export default [
    js.configs.recommended,
    {
        // extends: [
        //     "universe/native",
        //     "eslint:recommended",
        //     "plugin:react/recommended",
        //     "plugin:@typescript-eslint/recommended",
        //     "plugin:prettier/recommended"
        // ],
        files: ["src/**/*.ts"],
        ignores: ["dist/**", "README.md", "example/**"],
        languageOptions: {
            parser: { parse, parseForESLint },
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: {
                    jsx: true
                },
                sourceType: "module"
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        plugins: { react, "@typescript-eslint": ts, import: importPlugin, prettier },
        rules: {
            indent: "off",
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "import/order": [
                "error",
                {
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true
                    },
                    "newlines-between": "always"
                }
            ],
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-var-requires": 0,
            "prettier/prettier": ["error", { endOfLine: "auto" }, { usePrettierrc: true }]
        }
    }
];
