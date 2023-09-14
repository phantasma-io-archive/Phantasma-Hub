import { writable, type Writable } from 'svelte/store';
import { PhantasmaLink } from 'phantasma-ts';
import { PhantasmaAPI, type Contract } from 'phantasma-ts/src';
import type { ABIMethod } from 'phantasma-ts/src';
import { ModalInternalTypes } from '$lib/Components/Modals/ModalInternalTypes';
import { ethers } from 'ethers';
import moment from 'moment';

export const SimnetURL = 'http://127.0.0.1:7077/rpc';
export const TestnetURL = 'https://testnet.phantasma.io/rpc';
export const MainnetURL = 'https://bp1.phantasma.io/rpc';

export const SoftwareName = 'Phantasma Hub';
export const DefaultNetwork = 'testnet';
export const DefaultAPIURL = TestnetURL;

export const ExplorerURLMainnet = 'https://explorer.phantasma.io';
export const ExplorerURLTestnet = 'https://test-explorer.phantasma.io';
export const ExplorerURL = writable(ExplorerURLTestnet);

export const DateTimeFormat = moment.HTML5_FMT.DATETIME_LOCAL;

export const FeeAmount: number = 0.1 * 10 ** 10;
export const AirdropFee: number = 5.0 * 10 ** 10;
export const ContractFeeAmount: number = 100 * 10 ** 10;
export const TipAddress = 'P2KBktG2MFc6zc3Gsdrt5G4EntPTDBK3WW4mVQiqvAzppFk';
export const TipActive = writable(true);

export const EthereumProvider: Writable<ethers.BrowserProvider | null> = writable();
export const EthereumSigner: Writable<ethers.Signer | null> = writable();
export const EthereumAddress: Writable<string> = writable('');

export const SelectedNexus = writable(DefaultNetwork);
export const API_URL = writable(DefaultAPIURL);

export const SelectedContractName = writable('');
export const LinkWallet = writable(new PhantasmaLink('', true));
export const PhantasmaAPIClient = writable(new PhantasmaAPI(DefaultAPIURL, null, DefaultNetwork));
export const LinkDapp = writable('');
export const ActivePage = writable('');
export const APIStatus = writable(false);


export const GasPrice = writable(1000000);
export const GasLimit = writable(21000);

export const LeftSidebarMenu = writable(false);
export const RightSidebarMenu = writable(false);
export const Notifications = writable(false);
export const WalletOpened = writable(false);

export const ConnectWallet = writable(false);
export const ConnectedToWallet = writable(false);
export const AllContracts = writable(Array<string>());
export const ContractDetails: Writable<Contract> = writable();
export const ContractMethod: Writable<ABIMethod | undefined> = writable();
export const ConsoleOutput = writable('');

export const OpenedModal = writable(ModalInternalTypes.None);

// Votes
export const IsPollCreated = writable(false);
export const OrganizationIDVisble= writable("-1");
export const VotingSubjectVisible= writable("");
