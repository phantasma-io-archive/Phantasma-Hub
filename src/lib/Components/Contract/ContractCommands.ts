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

export function InvokeRawScript(
	contractName: string,
	contractMethod: string,
	args: any[],
	callback: any
) {
	const sb = new ScriptBuilder();
	const myScript = sb.BeginScript().CallContract(contractName, contractMethod, args).EndScript();

	api.invokeRawScript('main', myScript).then((result) => {
		callback(result);
	});
}

export function SendRawTransaction(contractName: string, contractMethod: string, args: Array<any>) {
	if (!Link.account) {
		alert('Please connect your wallet first');
		return;
	}

	const from = Address.FromText(String(Link.account.address));

	const payload = Base16.encode('Tools.' + contractName);
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', FeeAmount]);
	}
	const myScript = sb.CallContract(contractName, contractMethod, args).SpendGas(from).EndScript();

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

export function DeployContract(contractName: string, contractScript: string, contractABI: string) {
	if (!Link.account) {
		alert('Please connect your wallet first');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.DeployContract');
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', FeeAmount]);
	}
	const myScript = sb
		.CallInterop('Runtime.DeployContract', [from, contractName, contractScript, contractABI])
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

export function CreateToken(contractScript: string, contractABI: string) {
	if (!Link.account) {
		alert('Please connect your wallet first');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.CreateToken');
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', FeeAmount]);
	}
	const myScript = sb
		.CallInterop('Runtime.DeployContract', [from, contractScript, contractABI])
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

export function UpgradeContract(contractName: string, contractScript: string, contractABI: string) {
	if (!Link.account) {
		alert('Please connect your wallet first');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Tools.UpgradeContract');
	const sb = new ScriptBuilder();

	sb.AllowGas(from, Address.Null, gasPrice, gasLimit);
	if (tipActive) {
		sb.CallInterop('Runtime.TransferTokens', [from, TipAddress, 'KCAL', FeeAmount]);
	}
	const myScript = sb
		.CallInterop('Runtime.UpgradeContract', [from, contractName, contractScript, contractABI])
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

export async function GetTransactionByHash(txHash: string) {
	return await api.getTransaction(txHash);
}

export function DecodeInformation(data: string): VMObject {
	const bytes = Base16.decodeUint8Array(data);
	const vm = new VMObject();
	const reader = new PBinaryReader(bytes);
	vm.UnserializeData(reader);
	return vm;
}

// "04534f554c044b43414c2f5333644a57614c444b596868544866323845667350366174655a35773554655a55535638774d394a4e6661443739452f53336450364c52433366337877345a5a324848394251487a594e4875485338766574624351706b4d4676526d5645460600b4f135010007221d65b56004000203000d0000b036cc325c3eb5df1633000696d2a1ca0100010006c477e55f05000100"
export function DecodeStruct(bytes: Uint8Array, rawHex: string): any {
	const result = {};
	const reader = new PBinaryReader(bytes);
	console.log(rawHex);
	if (rawHex[1] == '4') {
		console.log(reader.readString());
		rawHex = rawHex.slice(reader.position, rawHex.length);
		return DecodeStruct(bytes, rawHex);
	}

	if (rawHex[1] == '5') {
		console.log(reader.readInt());
	}
	return result;
}

export function FormatData(vm: VMObject): any {
	const result: any = {};
	if (vm.Data instanceof Map && vm.Data instanceof Map<VMObject, VMObject>) {
		console.log('map', vm);
		for (const item of vm.Data) {
			const _key = item[0].AsString();
			result[_key] = FormatData(item[1]);
		}
	} else if (vm.Data instanceof Array) {
		const arr: any[] = [];
		console.log('array', vm);

		for (const item of vm.Data) {
			console.log('array item', item);
			arr.push(FormatData(item));
		}
		return arr;
	} else if (vm.Data instanceof VMObject) {
		console.log('vm data', vm);
		return FormatData(vm.Data);
	} else {
		console.log('vm', vm);
		if (vm.Type == VMType.Bytes) {
			const data = DecodeInformation(vm.AsString());
			return FormatData(data);
		}
		return vm.AsString();
	}
	return result;
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
