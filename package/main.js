#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const primary_options_1 = require("./primary-options");
const secondary_options_1 = require("./secondary-options");
const tertiary_options_1 = require("./tertiary-options");
const prompts_1 = require("prompts");
const chalk_1 = __importDefault(require("chalk"));
(async () => {
    let opts = {};
    const first = await prompts_1.prompts.select({
        type: 'select',
        name: 'value',
        message: 'I want to ',
        choices: primary_options_1.primaryOptions.map((o) => {
            return {
                title: o.label,
                value: o.value,
                disabled: false
            };
        })
    });
    opts.first = primary_options_1.primaryOptions.find(o => o.value == first);
    const second = await prompts_1.prompts.select({
        type: 'select',
        name: 'value',
        message: `I want to ${chalk_1.default.yellowBright(first)}`,
        choices: secondary_options_1.secondaryOptions[first].map((o) => {
            return {
                title: o.label,
                value: o.value,
                disabled: false
            };
        })
    });
    opts.secondary = secondary_options_1.secondaryOptions[first].find(o => o.value == second);
    if (secondary_options_1.secondaryOptions[first].find(o => o.value == second)?.usage) {
        printInfo();
    }
    else {
        const third = await prompts_1.prompts.select({
            type: 'select',
            name: 'value',
            message: `I want to ${chalk_1.default.yellowBright(first)} ${chalk_1.default.magentaBright(second)}`,
            choices: tertiary_options_1.tertiaryOptions[second].map((o) => {
                return {
                    title: o.label,
                    value: o.value
                };
            }),
            initial: 1
        });
        let thirdOption = tertiary_options_1.tertiaryOptions[second].find(o => o.value == third);
        if (thirdOption) {
            opts.tertiary = thirdOption;
            printInfo();
        }
    }
    function printInfo() {
        if (!opts.tertiary) {
            process.stdout.write(`Usage: ${chalk_1.default.greenBright(opts.secondary?.usage)}\r\n`);
            if (opts.secondary?.nb) {
                process.stdout.write(chalk_1.default.redBright(`NOTES: ${opts.secondary.nb}`));
            }
        }
        else {
            chalk_1.default.reset();
            process.stdout.write(`Usage: ${chalk_1.default.greenBright(opts.tertiary?.usage)}\r\n`);
            if (opts.secondary?.nb) {
                process.stdout.write(chalk_1.default.redBright(`NOTES: ${opts.secondary.nb}`));
            }
        }
    }
})();
