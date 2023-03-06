<script type="ts">
	import { allContracts, connectedToWallet, connectWallet, walletOpened } from '$lib/store';
	import { Base16, byteArrayToHex, uint8ArrayToHex } from 'phantasma-ts/core';
	import Card from '../Card/Card.svelte';
	import { CreateToken, DeployContract, UpgradeContract } from './ContractCommands';
	let contractName: string = '';

	let connected: boolean;
	let upgrade: boolean = false;
	let scriptFile;
	let abiFile;

	let scriptHexBytes: string = '';
	let abiHexBytes: string = '';
	let scriptBytes: Uint8Array;
	let abiBytes: Uint8Array;

	let contracts: Array<string>;

	allContracts.subscribe((value) => {
		contracts = value;
	});

	connectedToWallet.subscribe((value) => {
		console.log(value);
		connected = value;
	});

	function handleFileReader(file: ArrayBuffer | string | null, encode: boolean = true): string {
		if (!file) return '';
		if (file instanceof ArrayBuffer) {
			if (encode) {
				return Base16.encodeUint8Array(new Uint8Array(file));
			}
			return byteArrayToHex(file).toUpperCase();
		} else if (typeof file == typeof String) {
			if (encode) return Base16.encode(file);
			return file;
		}

		if (encode) return Base16.encode(file);
		return file;
	}

	$: if (scriptFile) {
		const reader = new FileReader();
		reader.onload = (e) => {
			console.log({ e });

			if (e.target instanceof FileReader) {
				if (scriptFile[0].name.endsWith('.pvm.hex')) {
					scriptHexBytes = handleFileReader(e.target.result, false);
				} else if (scriptFile[0].name.endsWith('.pvm')) {
					scriptHexBytes = handleFileReader(e.target.result);
				}
				if (e.target.result instanceof ArrayBuffer) {
					if (scriptFile[0].name.endsWith('.pvm.hex')) {
						scriptBytes = Base16.decodeUint8Array(uint8ArrayToHex(new Uint8Array(e.target.result)));
					} else {
						scriptBytes = new Uint8Array(e.target.result);
					}
				}
			}
		};

		reader.readAsArrayBuffer(scriptFile[0]);
	}

	$: if (abiFile) {
		const reader = new FileReader();
		reader.onload = (e) => {
			console.log('abi', { e });

			if (e.target instanceof FileReader) {
				if (abiFile[0].name.endsWith('.abi.hex')) {
					abiHexBytes = handleFileReader(e.target.result, false);
				} else if (abiFile[0].name.endsWith('.abi')) {
					abiHexBytes = handleFileReader(e.target.result);
				}
				if (e.target.result instanceof ArrayBuffer) {
					if (abiFile[0].name.endsWith('.pvm.hex')) {
						abiBytes = Base16.decodeUint8Array(uint8ArrayToHex(new Uint8Array(e.target.result)));
					} else {
						abiBytes = new Uint8Array(e.target.result);
					}
				}
			}
		};

		reader.readAsArrayBuffer(abiFile[0]);
	}

	$: if (contractName) {
		if (contracts.includes(contractName)) {
			upgrade = true;
		} else {
			upgrade = false;
		}
	}

	function upgradeContract() {
		UpgradeContract(contractName, scriptBytes, abiBytes);
	}

	function deployToken() {
		console.log('createToken');
		if (contracts.includes(contractName)) {
			upgradeContract();
			return;
		}

		CreateToken(scriptBytes, abiBytes);
	}

	function deployContract() {
		console.log('deployContract');
		if (contracts.includes(contractName)) {
			upgradeContract();
			return;
		}

		DeployContract(contractName, scriptBytes, abiBytes);
	}
</script>

<Card size="xl" title="Contract Deployer" description="Deploy your Smart Contract">
	<div class="my-1">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="contractName"
						id="contractName"
						bind:value={contractName}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="contractName"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Contract Name</label
					>
				</div>
			</div>

			<h5>Files</h5>

			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						accept=".hex, .pvm"
						type="file"
						name="scriptFile"
						id="scriptFile"
						bind:files={scriptFile}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="scriptFile"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Script File (.pvm)</label
					>
				</div>

				<div class="relative z-0 w-full mb-6 group">
					<input
						accept=".abi, .hex"
						type="file"
						name="abiFile"
						id="abiFile"
						bind:files={abiFile}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="abiFile"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>ABI File (.abi)</label
					>
				</div>
			</div>

			<hr class="my-6" />

			{#if connected}
				<div>
					{#if !upgrade}
						<button
							on:click={deployToken}
							class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							>Deploy Token</button
						>

						<button
							on:click={deployContract}
							class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							>Deploy Contract</button
						>
					{:else}
						<button
							on:click={upgradeContract}
							class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							>Upgrade Contract</button
						>
					{/if}
				</div>
			{:else}
				<h6 class="text-center">Connect to Wallet.</h6>
			{/if}
		</form>
	</div>
</Card>
