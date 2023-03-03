import { writable, type Writable } from 'svelte/store';
import { PhantasmaLink } from 'phantasma-ts';
import { PhantasmaAPI, type Contract } from 'phantasma-ts/src/core';
import type { ABIMethod } from 'phantasma-ts/core';

export const SimnetURL = 'http://127.0.0.1:5102/rpc';
export const TestnetURL = 'http://testnet.phantasma.io:5102/rpc';
export const MainnetURL = 'http://bp1.phantasma.io:7077/rpc';
export const FeeAmount = 0.1 * 10 ** 10;
export const TipAddress = 'P2KBktG2MFc6zc3Gsdrt5G4EntPTDBK3WW4mVQiqvAzppFk';
export const TipActive = writable(true);

export const contractName = writable('');
export const LinkWallet = writable(new PhantasmaLink('', true));
export const PhantasmaAPIClient = writable(new PhantasmaAPI(TestnetURL, null, 'testnet'));
export const LinkDapp = writable('');
export const activePage = writable('home');
export const apiStatus = writable(false);
export const apiLink = writable('');

export const GasPrice = writable(10000000);
export const GasLimit = writable(21000);

export const leftSidebarMenu = writable(false);
export const rightSidebarMenu = writable(false);
export const notifications = writable(false);
export const walletOpened = writable(false);

export const connectWallet = writable(false);
export const connectedToWallet = writable(false);
export const allContracts = writable(Array<string>());
export const contractDetails: Writable<Contract> = writable();
export const contractMethod: Writable<ABIMethod | undefined> = writable();
export const consoleOutput = writable('');
