import { writable } from 'svelte/store';
import { PhantasmaLink } from './phantasmaLink';

export const contractName = writable("");
export const LinkWallet = writable(new PhantasmaLink("", true));
export const activePage = writable("home");
export const apiStatus = writable(false);

export const leftSidebarMenu = writable(false);
export const rightSidebarMenu = writable(false);
export const notifications = writable(false);
