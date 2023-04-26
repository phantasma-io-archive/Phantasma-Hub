import { writable, type Writable } from 'svelte/store';
import { PhantasmaLink } from 'phantasma-ts';
import { PhantasmaAPI, type Contract } from 'phantasma-ts/src/core';
import type { ABIMethod } from 'phantasma-ts/core';
import { ModalInternalTypes } from '$lib/Components/Modals/ModalInternalTypes';

export const SimnetURL = 'http://127.0.0.1:7077/rpc';
export const TestnetURL = 'https://testnet.phantasma.io/rpc';
export const MainnetURL = 'https://bp1.phantasma.io/rpc';
export const FeeAmount: number = 0.1 * 10 ** 10;
export const AirdropFee: number = 5 * 10 ** 10;
export const ContractFeeAmount: number = 100 * 10 ** 10;
export const TipAddress = 'P2KBktG2MFc6zc3Gsdrt5G4EntPTDBK3WW4mVQiqvAzppFk';
export const TipActive = writable(true);

export const contractName = writable('');
export const LinkWallet = writable(new PhantasmaLink('', true));
export const PhantasmaAPIClient = writable(new PhantasmaAPI(TestnetURL, null, 'testnet'));
export const LinkDapp = writable('');
export const activePage = writable('');
export const apiStatus = writable(false);
export const apiLink = writable(TestnetURL);

export const GasPrice = writable(100000);
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

export const OpenedModal = writable(ModalInternalTypes.None);
