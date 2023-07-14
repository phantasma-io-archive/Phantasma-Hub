import {
	Address,
	PhantasmaAPI,
	ScriptBuilder,
	type Balance,
} from 'phantasma-ts/src';
import { GasLimit, GasPrice, LinkWallet, PhantasmaAPIClient } from '$lib/store';
import type { PhantasmaLink } from 'phantasma-ts';
import {
	Base16,
} from 'phantasma-ts/src';
import {
	NotificationError,
	NotificationSuccess
} from '$lib/Components/Notification/NotificationsBuilder';

let Link: PhantasmaLink;
LinkWallet.subscribe((link: any) => {
	Link = link;
});

let gasLimit: number;
GasLimit.subscribe((limit: any) => {
	gasLimit = limit;
});

let gasPrice: number;
GasPrice.subscribe((price: any) => {
	gasPrice = price;
});

let API : PhantasmaAPI;
PhantasmaAPIClient.subscribe((api: any) => {
	API = api;
});

export function createDAO(id: string, name: string, script: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));

	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Nexus.CreateOrganization', [from.Text, id, name, Base16.decodeUint8Array(script)])
		.SpendGas(from)
		.EndScript();
	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function addMember(
	organization_name: string,
	organization_address: Address,
	target: Address
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Organization.AddMember', [organization_address, organization_name, target.Text])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			//transaction.unserialize("");
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function removeMember(
	organization_name: string,
	organization_address: Address,
	target: Address
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Organization.RemoveMember', [
			organization_address,
			organization_name,
			target.Text
		])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			console.log(tx);
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function leaveDAO(organization_name: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Organization.RemoveMember', [from.Text, organization_name, from.Text])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}


export async function GetMembersCombinedBalances(members: string[]) : Promise<Balance[]> {
	const accounts = await API.getAccounts(members);
	let balances = [];
	let tempBalance : Balance = {
		symbol: 'SOUL',
		amount: "0",
		decimals: 8,
		chain: 'main'
	};

	const soulStakeBalance = {
		symbol: 'SOUL Staked',
		amount: 0,
		decimals: 8,
		chain: 'main'
	};

	const kcalUnclaimedBalance = {
		symbol: 'KCAL Unclaimed',
		amount: 0,
		decimals: 10,
		chain: 'main'
	};


	for (let i = 0; i < accounts.length; i++) {
		tempBalance = {
			symbol: 'SOUL',
			amount: "0",
			decimals: 8,
			chain: 'main'
		};

		soulStakeBalance.amount += parseInt(accounts[i].stakes.amount);
		kcalUnclaimedBalance.amount += parseInt(accounts[i].unclaimed);

		for (let j = 0; j < accounts[i].balances.length; j++)
		{
			if ( !balances[accounts[i].balances[j].symbol] ){
				balances[accounts[i].balances[j].symbol] = {
					symbol: accounts[i].balances[j].symbol,
					amount: parseInt(accounts[i].balances[j].amount),
					decimals: accounts[i].balances[j].decimals,
					chain: accounts[i].balances[j].chain
				};
			}else {
				balances[accounts[i].balances[j].symbol].amount += parseInt(accounts[i].balances[j].amount);
			}
		}
	}

	let balancesArray : Balance[] = [];
	balancesArray.push({
		symbol: 'SOUL Staked',
		amount: soulStakeBalance.amount.toString(),
		decimals: 8,
		chain: 'main'
	});
	balancesArray.push({
		symbol: 'KCAL Unclaimed',
		amount: kcalUnclaimedBalance.amount.toString(),
		decimals: 10,
		chain: 'main'
	});
	
	for ( let balance in balances ){
		balancesArray.push(balances[balance]);
	}

	return balancesArray;
}
