#! /usr/bin/env node

import {primaryOptions} from './primary-options';
import {secondaryOptions} from './secondary-options';
import {tertiaryOptions} from './tertiary-options';

import {prompts} from 'prompts';
import chalk from 'chalk';


(async ()=>{
    let opts:opts = {};
    const first = await prompts.select({
        type: 'select',
        name: 'value',
        message: 'I want to ',
        choices: primaryOptions.map((o) => {
            return {
                title: o.label,
                value: o.value,
                disabled:false
            };
        })
    }) as TBaseOptions;
    opts.first = primaryOptions.find(o=>o.value==first);

    const second = await prompts.select({
        type: 'select',
        name: 'value',
        message: `I want to ${chalk.yellowBright(first)}`,
        choices:
            (secondaryOptions as TSecondaryOptions)[first].map((o)=>{
                return{
                    title:o.label,
                    value:o.value,
                    disabled:false
                }
            })
    }) as TOptions;
    opts.secondary = secondaryOptions[first].find(o=>o.value==second);

    if(secondaryOptions[first].find(o=>o.value==second)?.usage){
        printInfo()
    }
    else{
        const third = await prompts.select({
            type: 'select',
            name: 'value',
            message: `I want to ${chalk.yellowBright(first)} ${chalk.magentaBright(second)}`,
            choices:
                (tertiaryOptions as TTertiaryOptions)[second].map((o)=>{
                    return{
                        title:o.label,
                        value:o.value
                    }
                }),
            initial: 1
        });
        let thirdOption = tertiaryOptions[second].find(o=>o.value==third);
        if(thirdOption){
            opts.tertiary=thirdOption;
            printInfo();
        }
    }
    function printInfo(){
        if(!opts.tertiary){
            process.stdout.write(`Usage: ${chalk.greenBright(opts.secondary?.usage)}\r\n`);
            if(opts.secondary?.nb){
                process.stdout.write(chalk.redBright(`NOTES: ${opts.secondary.nb}`))
            }
        }
        else{
            chalk.reset()
            process.stdout.write(`Usage: ${chalk.greenBright(opts.tertiary?.usage)}\r\n`);
            if(opts.secondary?.nb){
                process.stdout.write(chalk.redBright(`NOTES: ${opts.secondary.nb}`))
            }
        }
        
    }
})()

export type TPrimaryOption = {
    value:string,
    label:string,
    usage?:string,
    nb?:string
  }
  
export type TBaseOptions = keyof typeof secondaryOptions;
export type TSecondaryOptions = {
  [key in TBaseOptions]: TPrimaryOption[];
};
export type TOptions = keyof typeof tertiaryOptions;
export type TTertiaryOptions = {
  [key in TOptions]: TPrimaryOption[];
};
interface opts{
    first?:TPrimaryOption,
    secondary?:TPrimaryOption,
    tertiary?:TPrimaryOption
}