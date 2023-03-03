import {
	Address,
	byteArrayToHex,
	PBinaryWriter,
	PhantasmaAPI,
	PollChoice,
	ScriptBuilder,
	Transaction,
	VMType
} from 'phantasma-ts/core';
import {
	apiLink,
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
	ConsensusMode,
	ConsensusPoll,
	hexStringToUint8Array,
	PBinaryReader,
	PollState,
	Serialization,
	stringToUint8Array,
	Timestamp,
	uint8ArrayToString,
	VMObject
} from 'phantasma-ts/core';

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

export async function GetTransactionByHash(txHash: string) {
	return await api.getTransaction(txHash);
}

export function TransferTokens(symbol: string, amount: number, to: string) {
	if (!Link.account) {
		alert('Please connect your wallet first');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.TransferTokens');

	const toAddress = Address.FromText(to);
	const sb = new ScriptBuilder();
	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', FeeAmount]);
	}
	const myScript = sb
		.CallInterop('Runtime.TransferTokens', [from, to, symbol, amount])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			console.log(tx);
		},
		function () {
			console.error('error');
		}
	);
}
