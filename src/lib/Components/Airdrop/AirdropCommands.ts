import {
	Address,
	PhantasmaAPI,
	ScriptBuilder,
	Token,
	Base16,
} from 'phantasma-ts/src';
import {
	AirdropFee,
	GasLimit,
	GasPrice,
	LinkWallet,
	PhantasmaAPIClient,
	TipActive,
	TipAddress
} from '$lib/store';
import type { PhantasmaLink } from 'phantasma-ts';
import { NotificationError, NotificationSuccess } from '../Notification/NotificationsBuilder';

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

export async function GetNFTList(symbol: string): Promise<string[]> {
	if (!Link.account) {
		return [];
	}

	const from = String(Link.account.address);
	const _account = await api.getAccount(from);
	for (const balance of _account.balances) {
		console.log(balance, symbol);
		if (balance.symbol == symbol) {
			return balance.ids ? balance.ids : [];
		}
	}

	return [];
}

export function GetFundsForSymbol(symbol: string): number {
	if (!Link.account) {
		return 0;
	}

	for (const balance of Link.account.balances) {
		if (balance.symbol == symbol) {
			return balance.value;
		}
	}

	return 0;
}

export function AirdropFT(
	symbol: string,
	token: Token,
	userList: Array<{ user; amount }>,
	totalAmount: number
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	if (!userList || userList.length == 0) {
		NotificationError('Airdrop Error!', 'Please add at least one user.');
		return;
	}

	let tokenBalance: number = GetFundsForSymbol(symbol);
	if (tokenBalance == undefined || tokenBalance == null) tokenBalance = 0;
	if (tokenBalance < totalAmount) {
		NotificationError('Airdrop Error!', 'You do not have enough funds to perform this airdrop.');
		return;
	}

	const numberOfDistributions = userList.length / 100;
	let comulativeFee = (userList.length / 100) * AirdropFee;
	if (numberOfDistributions < 1) comulativeFee = AirdropFee;
	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.AirdropFT');
	const sb = new ScriptBuilder();
	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);

	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', String(comulativeFee)]);
		//sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', comulativeFee]);
	}

	for (const user of userList) {
		const toAddress = Address.FromText(user.user);
		const amount = String(user.amount);
		sb.CallInterop('Runtime.TransferTokens', [from, toAddress, symbol, amount]);
	}
	const myScript = sb.SpendGas(from).EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			console.log('Here we have it!', tx);
			NotificationSuccess(
				'Airdrop Success!',
				`Amazing you did an Airdrop to ${userList.length} SOULDiers and total amount was ${(
					totalAmount /
					10 ** token.decimals
				).toFixed(2)} ${symbol}!`
			);
		},
		function () {
			NotificationError('Airdrop Error!', 'Error doing the Airdrop!');
		}
	);
}

export function AirdropNFT(symbol: string, userList: Array<{ user; id }>, totalAmount: number) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	if (!userList || userList.length == 0) {
		NotificationError('Airdrop Error!', 'Please add at least one user.');
		return;
	}

	let tokenBalance: number = GetFundsForSymbol(symbol);
	if (tokenBalance == undefined || tokenBalance == null) tokenBalance = 0;
	if (tokenBalance < totalAmount) {
		NotificationError('Airdrop Error!', 'You do not have enough funds to perform this airdrop.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.AirdropNFT');

	const numberOfDistributions = userList.length / 100;
	let comulativeFee = (userList.length / 100) * AirdropFee;
	if (numberOfDistributions < 1) comulativeFee = AirdropFee;
	const sb = new ScriptBuilder();
	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		//sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', comulativeFee]);
	}

	for (const user of userList) {
		const toAddress = Address.FromText(user.user);
		const id = String(user.id);
		sb.CallInterop('Runtime.TransferToken', [from, toAddress, symbol, id]);
	}

	const myScript = sb.SpendGas(from).EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess(
				'Airdrop Success!',
				`Amazing you did an Airdrop to ${userList.length} SOULDiers of NFT's, total number of was ${totalAmount} ${symbol}!`
			);
		},
		function () {
			NotificationError('Airdrop Error!', 'Error doing the Airdrop!');
		}
	);
}
