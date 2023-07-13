<script lang="ts">
	import { LinkWallet } from '$lib/store';
	import { Buffer } from 'buffer';
	globalThis.Buffer = Buffer;

	import { ScriptBuilder, Decoder, generateNewWif } from 'phantasma-ts/src';
	import { PhantasmaLink } from 'phantasma-ts';
	import { Address } from 'phantasma-ts/src';
	//global = window;
	let Link: PhantasmaLink;
	LinkWallet.subscribe((value) => {
		Link = value;
	});

	let contractName = 'pharming';

	function UpdateOwner() {
		console.log(Link);
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let address = String(Link.account.address);
		let gasPrice = 100000;
		let gasLimit = 9999999;
		let to = 'P2K4WKrP4yrBwDKZoQjUJCfHKf3N4Uqd5qXPygYGTSR5B7n';
		var sb = new ScriptBuilder();
		var myScript = sb
			.AllowGas(address, Address.Null, gasPrice, gasLimit)
			.CallContract(contractName, 'updateOwner', [String(to)])
			.SpendGas(address)
			.EndScript();

		Link.signTx(
			myScript,
			contractName,
			function (script) {
				console.log('Update Owner', `Owner updated with success to <b>${to}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}

	function UpdateOwnerBack() {
		console.log(Link);
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let address = String(Link.account.address);
		let gasPrice = 100000;
		let gasLimit = 9999999;
		let to = 'P2KKXMXDKwG9s6wPw6FA4hrCbgEgVossLuyzCyKZpQiFhMj';
		var sb = new ScriptBuilder();
		var myScript = sb
			.AllowGas(address, Address.Null, gasPrice, gasLimit)
			.CallContract(contractName, 'updateOwner', [String(to)])
			.SpendGas(address)
			.EndScript();

		Link.signTx(
			myScript,
			contractName,
			function (script) {
				console.log('Update Owner', `Owner updated with success to <b>${to}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}

	function SendTX() {
		console.log(Link);
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let address = String(Link.account.address);
		let to = String('P2K4WKrP4yrBwDKZoQjUJCfHKf3N4Uqd5qXPygYGTSR5B7n');
		let amount = String(0.5 * 10 ** 10);
		let gasPrice = 10000;
		let gasLimit = 999999;
		var sb = new ScriptBuilder();
		var myScript = sb
			.AllowGas(address, Address.Null, gasPrice, gasLimit)
			.CallInterop('Runtime.TransferTokens', [address, to, 'KCAL', amount])
			.SpendGas(address)
			.EndScript();

		Link.signTx(
			myScript,
			'tx',
			function (script) {
				console.log('Transaction Owner', `Owner updated with success to <b>${to}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}

	function StakeCallExample() {
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let address = String(Link.account.address);
		let amount = String(100 * 10 ** 8); // 100 the amount - 10**8 it's to get the decimals to the desired amount
		let gasPrice = 10000; // Soul has 8 decimals places.
		let gasLimit = 999999;
		let payload = 'something';
		var sb = new ScriptBuilder();
		var myScript = sb
			.AllowGas(address, Address.Null, gasPrice, gasLimit)
			.CallContract('stake', 'stake', [address, amount])
			.SpendGas(address)
			.EndScript();

		Link.signTx(
			myScript,
			payload,
			function (script) {
				console.log('Stake call was successful', `Stake was staked <b>${amount}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}

	function SwapFeeWithoutMoney() {
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let address = String(Link.account.address);
		let amount = String(1 * 10 ** 8); // 100 the amount - 10**8 it's to get the decimals to the desired amount
		let gasPrice = 100000; // Soul has 8 decimals places.
		let gasLimit = 210000;
		let payload = 'something';
		var sb = new ScriptBuilder();
		var myScript = sb
			.CallContract('swap', 'SwapFee', [address, 'SOUL', amount])
			.AllowGas(address, Address.Null, gasPrice, gasLimit)
			.SpendGas(address)
			.EndScript();

		Link.signTx(
			myScript,
			payload,
			function (script) {
				console.log('Stake call was successful', `Stake was staked <b>${amount}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}

	/*function GetInfo() {
		console.log(Link);
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let address = String(Link.account.address);
		let to = String('P2K4WKrP4yrBwDKZoQjUJCfHKf3N4Uqd5qXPygYGTSR5B7n');

		var sb = new ScriptBuilder();
		var myScript = sb.callContract(contractName, 'getUnclaimed', [to, 'KCAL', 'BNB']).endScript();

		Link.invokeScript(myScript, contractName, function (script) {
			let result = new Decoder(script.result).readBigInt();
			console.log('GetInfo', `Get Info ${result}`);
		});
	}

	function GetInfoFarm() {
		console.log(Link);
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let gasPrice = 10000;
		let gasLimit = 999999;
		let address = String(Link.account.address);
		var sb = new ScriptBuilder();
		var myScript = sb
			.allowGas(address, sb.nullAddress, gasPrice, gasLimit)
			.callContract(contractName, 'getFarmInfo', ['KCAL', 'BNB'])
			.spendGas(address)
			.endScript();

		Link.signTx(
			myScript,
			'tx',
			function (script) {
				console.log('Transaction Owner', `Owner updated with success to <b>${to}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}

	function MintTokens() {
		console.log(Link);
		if (!Link.account) console.log('Phantasma Link', `Not connected to a wallet.`, 'error');

		let gasPrice = 10000;
		let gasLimit = 999999;
		let amount = String(10000 * 10 ** 8);
		let address = String(Link.account.address);
		let soulAddress = 'S3dJWaLDKYhhTHf28EfsP6ateZ5w5TeZUSV8wM9JNfaD79E';
		var sb = new ScriptBuilder();
		var myScript = sb
			.AllowGas(address, Address.Null, gasPrice, gasLimit)
			.CallInterop('Runtime.MintTokens', [soulAddress, address, 'SOUL', amount])
			.SpendGas(address)
			.EndScript();

		Link.signTx(
			myScript,
			'tx',
			function (script) {
				console.log('Transaction Owner', `Owner updated with success to <b>${to}</b>`);
			},
			function (error) {
				console.log(error);
			}
		);
	}*/

	function getMyNewWif() {
		console.log(generateNewWif());
	}
</script>

<svelte:window />

<!--
<button on:click={() => UpdateOwner()} >
    Update
</button>

<button class="p-8 bg-slate-400" on:click={() => UpdateOwnerBack()} >
    Update Owner Back
</button>

<button on:click={() => GetInfo()} >
    GetInfo
</button>

<button on:click={() => GetInfoFarm()} >
    GetInfoFarm
</button>

<button on:click={() => SendTX()} >
    Send Transaction
</button>-->

<!--<button class="m-5" on:click={() => MintTokens()}> Mint tokens </button>-->

<button class="m-5" on:click={() => SwapFeeWithoutMoney()}> SwapFee </button>

<button class="m-5" on:click={() => getMyNewWif()}> getMyNewWif </button>
