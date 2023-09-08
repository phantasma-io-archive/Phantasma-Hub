import {
	Address,
	byteArrayToHex,
	PBinaryWriter,
	PhantasmaAPI,
	ScriptBuilder,
	Transaction,
	Base16,
	Serialization,
	Timestamp,
	PBinaryReader,
	VMObject,
	ConsensusMode, 
	ConsensusPoll, 
	PollChoice
} from 'phantasma-ts/src';
import { GasLimit, GasPrice, IsPollCreated, LinkWallet, PhantasmaAPIClient } from '$lib/store';
import  { PhantasmaLink } from 'phantasma-ts';
import {
	NotificationError,
	NotificationSuccess
} from '$lib/Components/Notification/NotificationsBuilder';

export class PollVote {
	public index: number | undefined;
	public value: string | undefined;
}

let localGasPrice: number;
GasPrice.subscribe((gasPrice) => {
	localGasPrice = gasPrice;
});

let localGasLimit: number;
GasLimit.subscribe((gasLimit) => {
	localGasLimit = gasLimit;
});

let Link: PhantasmaLink;
LinkWallet.subscribe((link) => {
	Link = link;
});

let ApiClient: PhantasmaAPI;
PhantasmaAPIClient.subscribe((api) => {
	ApiClient = api;
});

//          InitPoll(Address from, string subject, string organization, ConsensusMode mode, Timestamp startTime, Timestamp endTime, byte[] serializedChoices, BigInteger votesPerUser)
//        public void SingleVote(Address from, string subject, BigInteger index)
//        public void MultiVote(Address from, string subject, PollVote[] choices)
//         public bool HasConsensus(string subject, byte[] value)
//         public BigInteger GetRank(string subject, byte[] value)
//         public ConsensusPoll GetConsensusPoll(string subject)
//         public ConsensusPoll[] GetConsensusPolls()

// TODO:

export function initPoll(
	subject: string,
	organization: string,
	mode: ConsensusMode,
	startTime: Timestamp,
	endTime: Timestamp,
	choices: PollChoice[],
	votesPerUser: string
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');

	const choice1Serialized = Serialization.Serialize(choices);
	const hex = Base16.encodeUint8Array(choice1Serialized);

	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, localGasPrice, localGasLimit)
		.CallContract('consensus', 'InitPoll', [
			from.Text,
			subject,
			organization,
			mode,
			startTime,
			endTime,
			choice1Serialized,
			votesPerUser
		])
		.SpendGas(from)
		.EndScript();

	console.log(myScript);

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			IsPollCreated.set(true);
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			//console.error(error);
		}
	);
}

export function singleVote(subject: string, index: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');

	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, localGasPrice, localGasLimit)
		.CallContract('consensus', 'SingleVote', [from, subject, index])
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

export function multiVote(subject: string, choices: PollVote[]) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');

	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, localGasPrice, localGasLimit)
		.CallContract('consensus', 'MultiVote', [from, subject, choices])
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

export function hasConsensus(subject: string, value: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');

	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, localGasPrice, localGasLimit)
		.CallContract('consensus', 'HasConsensus', [subject, value])
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

export function getRank(subject: string, value: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');

	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, localGasPrice, localGasLimit)
		.CallContract('consensus', 'GetRank', [subject, value])
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

export async function getConsensusPoll(subject: string) {
	const sb = new ScriptBuilder();
	const myScript = sb.CallContract('consensus', 'GetConsensusPoll', [subject]).EndScript();

	// Use the API
	const chainInput = 'main';

	const poll = await ApiClient.invokeRawScript(chainInput, myScript).then((result) => {
		const bytes = Base16.decodeUint8Array(result.result);
		const vm = new VMObject();
		const readerVM = new PBinaryReader(bytes);
		vm.UnserializeData(readerVM);
		const localResult: ConsensusPoll = vm.ToStruct<ConsensusPoll>(ConsensusPoll);
		return localResult;
	});

	return poll;
}

export async function getConsensusPolls() {
	const sb = new ScriptBuilder();
	const myScript = sb.CallContract('consensus', 'GetConsensusPolls', []).EndScript();
	const chainInput = 'main';

	const polls = await ApiClient.invokeRawScript(chainInput, myScript).then((result) => {
		const localResults = result.results;
		const binaryReaderG = new PBinaryReader(Base16.decodeUint8Array(result.result));
		const vm = new VMObject();
		vm.UnserializeData(binaryReaderG);
		let test = vm.ToArray(ConsensusPoll);

		const results: ConsensusPoll[] = [];
		for (let i = 0; i < test.length; i++) {
			const binaryReader = new PBinaryReader(Base16.decodeUint8Array(test[i]));
			//const consensusPoll : ConsensusPoll = vm.ToStruct<ConsensusPoll>(ConsensusPoll);
			const consensusPoll : ConsensusPoll = ConsensusPoll.Unserialize(binaryReader);
			console.log(consensusPoll);
			results.push(consensusPoll);
		}
		
		return results;
	});

	return polls;
}

