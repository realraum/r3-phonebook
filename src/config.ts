import fs from 'fs';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import * as path from 'path';

export interface PhoneEntry {
    phone_number: string;
    name: string;
}

// config object that can be imported and saved to config.json. Saves phone number list
export interface Config {
    phone_list: PhoneEntry[];
}

export const config: Config = {
    phone_list: [],
}

export function loadConfig(): Config {
    try {
        const configFile = fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8');

        if (configFile.length === 0) {
            saveConfig(config);
            return config;
        }

        return JSON.parse(configFile);
    } catch (e) {
        return config;
    }
}

export function saveConfig(config: Config): void {
    fs.writeFileSync(path.join(__dirname, '..', 'config.json'), JSON.stringify(config, null, 4));
}

export function addPhone(phone_number: string, name: string): void {
    const phone_list = getPhoneList();
    phone_list.push({ phone_number, name });
    saveConfig({ phone_list });
}

export function removePhone(phone_number: string): void {
    let phone_list = getPhoneList();
    phone_list = phone_list.filter(entry => entry.phone_number !== phone_number);
    saveConfig({ phone_list });
}

export function getPhoneList(): PhoneEntry[] {
    return loadConfig().phone_list;
}

export function getPhoneName(phone_number: string): string {
    const phone_list = getPhoneList();
    const entry = phone_list.find(entry => entry.phone_number === phone_number);
    return entry ? entry.name : '';
}

export function getPhoneNumber(name: string): string {
    const phone_list = getPhoneList();
    const entry = phone_list.find(entry => entry.name === name);
    return entry ? entry.phone_number : '';
}

export function getPhoneNumberList(): string[] {
    const phone_list = getPhoneList();
    return phone_list.map(entry => entry.phone_number);
}

export default config;