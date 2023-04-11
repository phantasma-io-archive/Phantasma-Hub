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
	AirdropFee,
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
import { ProofOfWork } from 'phantasma-ts/core/link/phantasmaLink';
import { NotificationError } from '../Notification/NotificationsBuilder';

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

export function GetFundsForSymbol(symbol: string) {
	return Link.account.balances.find((balance) => balance.symbol == symbol);
}

export function AirdropFT(symbol: string, userList: Array<{ user; amount }>, totalAmount: number) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	console.log({ Link });
	console.log({ userList });
	if (!userList || userList.length == 0) {
		NotificationError('Airdrop Error!', 'Please add at least one user.');
		return;
	}

	const test = GetFundsForSymbol(symbol);
	console.log({ test });
	if (GetFundsForSymbol(symbol) < totalAmount) {
		NotificationError('Airdrop Error!', 'You do not have enough funds to perform this airdrop.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.TransferTokens');

	const sb = new ScriptBuilder();
	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', AirdropFee]);
	}

	for (const user of userList) {
		const toAddress = Address.FromText(user.user);
		const amount = user.amount;
		sb.CallInterop('Runtime.TransferTokens', [from, toAddress, symbol, amount]);
	}
	const myScript = sb.SpendGas(from).EndScript();

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

export function AirdropNFT(symbol: string, amount: number, to: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
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
		.CallInterop('Runtime.TransferToken', [from, to, symbol, amount])
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
