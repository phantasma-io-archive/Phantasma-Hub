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
import {
	NotificationError,
	NotificationSuccess
} from '$lib/Components/Notification/NotificationsBuilder';
import { GetTransactionByHash } from '$lib/Commands/Commands';

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
export function InvokeRawScript(myScript: string, callback: any) {
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
export function SendRawTransaction(myScript: string, callbackSuccess: any, callbackError: any) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));

	const payload = Base16.encode('Tools.HexScript');
	// Add fee to the tx's

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
					NotificationSuccess('Transaction Successful!', 'Transaction executed successfully.');
				} else {
					NotificationError('Transaction Error', 'Error burning tokens.');
				}
			});
		},
		function () {
			callbackError('error');
			NotificationError('Transaction Error', `Error calling Hex Script.`);
		}
	);
}
