import {
	Address,
	byteArrayToHex,
	PBinaryWriter,
	PhantasmaAPI,
	PollChoice,
	ScriptBuilder,
	Transaction,
	VMType
} from 'phantasma-ts/src';
import {
	FeeAmount,
	GasLimit,
	GasPrice,
	LinkWallet,
	PhantasmaAPIClient,
	TipActive,
	TipAddress
} from '$lib/store';
import type { PhantasmaLink } from 'phantasma-ts';
import {
	Base16,
} from 'phantasma-ts/src';
import { NotificationError, NotificationSuccess } from '../Notification/NotificationsBuilder';
import { GetTransactionByHash } from '$lib/Commands/Commands';
import { ProofOfWork } from 'phantasma-ts/src/core/link/phantasmaLink';

let Link: PhantasmaLink;
LinkWallet.subscribe((link: any) => {
	Link = link;
});

let api: PhantasmaAPI;
PhantasmaAPIClient.subscribe((client: any) => {
	api = client;
});

let gasLimit: number;
GasLimit.subscribe((limit: any) => {
	gasLimit = limit;
});

let gasPrice: number;
GasPrice.subscribe((price: any) => {
	gasPrice = price;
});

let tipActive: boolean;
TipActive.subscribe((active: boolean) => {
	tipActive = active;
});

/**
 * InvokeRawScript
 * @param contractName
 * @param contractMethod
 * @param args
 * @param callback
 */
export function InvokeRawScript(
	contractName: string,
	contractMethod: string,
	args: any[],
	callback: any
) {
	const sb = new ScriptBuilder();
	const myScript = sb.BeginScript().CallContract(contractName, contractMethod, args).EndScript();

	api.invokeRawScript('main', myScript).then((result) => {
		NotificationSuccess('Invoked Successfully!', 'Contract data fetched successfully.');
		callback(result);
	});
}

/**
 *
 * @param contractName
 * @param contractMethod
 * @param args
 * @param callbackSuccess
 * @param callbackError
 * @returns
 */
export function SendRawTransaction(
	contractName: string,
	contractMethod: string,
	args: Array<any>,
	callbackSuccess: any,
	callbackError: any
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));

	const payload = Base16.encode('Tools.' + contractName);
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', FeeAmount * 100]);
	}
	const myScript = sb.CallContract(contractName, contractMethod, args).SpendGas(from).EndScript();

	Link.signTx(
		myScript,
		payload,
		async function (tx) {
			console.log(tx);
			NotificationSuccess('Fetching Transaction!', 'Retriving transaction from the blockchain...');
			await new Promise((f) => setTimeout(f, 5000));
			GetTransactionByHash(tx.hash).then((result) => {
				callbackSuccess(result);
				if (result.state.includes('Halt')) {
					NotificationSuccess(
						'Burned Successfully!',
						'Tokens burned successfully. You can check the transaction details in the transaction history.'
					);
				} else {
					NotificationError('Transaction Error', 'Error burning tokens.');
				}
			});
		},
		function () {
			callbackError('error');
			NotificationError(
				'Transaction Error',
				`Error calling ${contractName} contract, method ${contractMethod} tokens.`
			);
		}
	);
}

/**
 * Deploy Smartcontract
 * @param contractName
 * @param contractScript
 * @param contractABI
 * @returns
 */
export function DeployContract(
	contractName: string,
	contractScript: Uint8Array,
	contractABI: Uint8Array
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.DeployContract');
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', String(FeeAmount)]);
	}
	const myScript = sb
		.CallInterop('Runtime.DeployContract', [from, contractName, contractScript, contractABI])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		async function (tx) {
			console.log(tx);
			NotificationSuccess('Fetching Transaction!', 'Retriving transaction from the blockchain...');
			await new Promise((f) => setTimeout(f, 5000));
			GetTransactionByHash(tx.hash).then((result) => {
				if (result.state.includes('Halt')) {
					NotificationSuccess(
						'Deployed Contract Successfully!',
						`Deployed ${contractName} contract successfully.`
					);
				} else {
					NotificationError('Deploying Contract Error', 'Error deploying contract.');
				}
			});
		},
		function () {
			NotificationError('Transaction Error', 'Error deploying contract.');
		},
		ProofOfWork.Minimal
	);
}

/**
 * Create Token
 * @param contractScript
 * @param contractABI
 * @returns
 */
export function CreateToken(contractScript: Uint8Array, contractABI: Uint8Array) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.CreateToken');
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', String(FeeAmount)]);
	}

	const myScript = sb
		.CallInterop('Nexus.CreateToken', [from, contractScript, contractABI])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		async function (tx) {
			console.log(tx);
			NotificationSuccess('Fetching Transaction!', 'Retriving transaction from the blockchain...');
			await new Promise((f) => setTimeout(f, 5000));
			GetTransactionByHash(tx.hash).then((result) => {
				if (result.state.includes('Halt')) {
					NotificationSuccess('Token created Successfully!', 'Token created successfully.');
				} else {
					NotificationError('Token creation Error', 'Error creating token.');
				}
			});
		},
		function () {
			NotificationError('Transaction Error', 'Error creating token.');
		},
		ProofOfWork.Minimal
	);
}

/**
 * Upgrade Contract
 * @param contractName
 * @param contractScript
 * @param contractABI
 * @returns
 */
export function UpgradeContract(
	contractName: string,
	contractScript: Uint8Array,
	contractABI: Uint8Array
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.UpgradeContract');
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', String(FeeAmount)]);
	}
	const myScript = sb
		.CallInterop('Runtime.UpgradeContract', [from, contractName, contractScript, contractABI])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		async function (tx) {
			console.log(tx);
			NotificationSuccess('Fetching Transaction!', 'Retriving transaction from the blockchain...');
			await new Promise((f) => setTimeout(f, 5000));
			GetTransactionByHash(tx.hash).then((result) => {
				if (result.state.includes('Halt')) {
					NotificationSuccess('Upgraded Successfully!', 'Contract upgraded successfully.');
				} else {
					NotificationError('Upgrade Error', 'Error upgrading contract.');
				}
			});
		},
		function () {
			NotificationError('Transaction Error', 'Error upgrading contract.');
		},
		ProofOfWork.Minimal
	);
}

export function IncreaseContractStorage(contractName: string, soulToStake: number){
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.IncreaseStorage');
	const sb = new ScriptBuilder();

	const myScript = sb.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Runtime.TransferTokens', [String(from), String(contractName), "SOUL", String(soulToStake)])
		.CallContract("stake", "Stake", [contractName, String(soulToStake)])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		async function (tx) {
			console.log(tx);
			NotificationSuccess('Fetching Transaction!', 'Retriving transaction from the blockchain...');
			await new Promise((f) => setTimeout(f, 5000));
			GetTransactionByHash(tx.hash).then((result) => {
				if (result.state.includes('Halt')) {
					NotificationSuccess('Upgraded Successfully!', 'Contract upgraded successfully.');
				} else {
					NotificationError('Upgrade Error', 'Error upgrading contract.');
				}
			});
		},
		function () {
			NotificationError('Transaction Error', 'Error upgrading contract.');
		}
	);
}
