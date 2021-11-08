import fetch from 'node-fetch';
import {writeFileSync} from 'fs';

const repoBase = `https://raw.githubusercontent.com/summitech/gitexplorer/master`;
const options = ['primary','secondary','tertiary'];
(async ()=>{
    for (const option of options) {
        await getOptions(option);
    }
})();

/**
 * 
 * @param {"primary"|"secondary"|"tertiary"} which 
 */
async function getOptions(which){
    const req = await fetch(`${repoBase}/src/data/${which}-options.js`);
    if(req.ok){
        const res = await req.text();
        writeFileSync(`src/${which}-options.ts`,res);
    }
    else{
        throw new Error(`Can't fetch ${which}-options.js from https://github.com/summitech/gitexplorer/blob/master/src/data/`)
    }
}