<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { ConsoleOutput, ContractMethod, SelectedContractName } from '$lib/store';
	import { Base16, type ABIMethod, type ABIParameter } from 'phantasma-ts/src';
	import { InvokeRawScript, SendRawTransaction } from './ContractCommands';
	import { DecodeInformation, DecodeStruct, FormatData } from '$lib/Commands/Commands';
	let _contractName: string;
	let _methodName;
	let method: ABIMethod | undefined;
	let parameters: Array<ABIParameter> = [];
	let args = [];

	SelectedContractName.subscribe((value) => {
		_contractName = value;
	});

	ContractMethod.subscribe((value) => {
		method = value;
		parameters = [];
		args = [];
		if (value != null) {
			method = value;
			_methodName = value.name;

			if (value.parameters.length > 0) {
				parameters = [];
				args = [];
				for (let param of value.parameters) {
					parameters.push(param);
				}
			}

			console.log(method);
		}
	});

	function invokeRawScript() {
		let fixedArgs: Array<string> = [];
		for (let param of parameters) {
			let arg: string = args[param.name];
			fixedArgs.push(arg);
		}

		let result = InvokeRawScript(_contractName, _methodName, fixedArgs, (result) => {
			let resultsArray = [];
			if (result.results.length <= 0) {
				console.log('no results');
				return;
			}

			console.log(result);
			try {
				let decoded = DecodeInformation(result.results[0]);
				let formatedData = FormatData(decoded);
				resultsArray.push(formatedData);
				console.log('formated data: ', formatedData);
				ConsoleOutput.set(JSON.stringify(resultsArray, null, 2));
			} catch (e) {
				console.log('error: ', e);
				ConsoleOutput.set(JSON.stringify(result, null, 2));
			}
		});
	}

	function sendRawTransaction() {
		// DO SOMETHING
		let fixedArgs: Array<string> = [];
		for (let param of parameters) {
			let arg: string = args[param.name];
			fixedArgs.push(arg);
		}

		SendRawTransaction(
			_contractName,
			_methodName,
			fixedArgs,
			(result) => {
				// Get Transaction Result by Hash
				console.log(result);
				ConsoleOutput.set(JSON.stringify(result, null, 2));
			},
			(error) => {
				console.log(error);
			}
		);
	}

	function testDecode() {
		let data =
			'04534f554c044b43414c2f5333644a57614c444b596868544866323845667350366174655a35773554655a55535638774d394a4e6661443739452f53336450364c52433366337877345a5a324848394251487a594e4875485338766574624351706b4d4676526d5645460600b4f135010007221d65b56004000203000d0000b036cc325c3eb5df1633000696d2a1ca0100010006c477e55f05000100';
		let bytes = Base16.decodeUint8Array(data);
		DecodeStruct(bytes, data);
	}
	testDecode();
</script>

<Card
	size="xl"
	title="Contract Arguments"
	description="Fill in the contract arguments to call make the call to the contract."
>
	<div class="my-1">
		{#if method == null}
			<div>
				<p class="mb-0 font-sans font-semibold leading-normal text-base">No method selected</p>
				<h5 class="mb-0 font-normal text-sm">Select a method to interact with the contract.</h5>
			</div>
		{:else}
			<form on:submit|preventDefault={() => null}>
				<div class="grid md:grid-cols-2 md:gap-6">
					{#each parameters as param}
						<div class="relative z-0 w-full mb-6 group">
							<input
								type="text"
								name="method"
								id="method"
								bind:value={args[param.name]}
								class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								required
							/>
							<label
								for="method"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>{param.name} ({param.type})</label
							>
						</div>
					{/each}
				</div>

				<hr class="my-1" />

				<div>
					<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Options</h3>
					<button
						on:click={invokeRawScript}
						class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>Invoke Transaction</button
					>
					<button
						on:click={sendRawTransaction}
						class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>Send Raw Transaction</button
					>
				</div>

				<!--<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
					Users to Multi-Signature
				</h3>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					Add user addresses to sign the transaction.
				</p>
				<button
					on:click={addUser}
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Add more Users
				</button>
			</div>

			<div class="grid md:grid-cols md:gap-6 my-4">
				{#each Array(numberOfUsers) as _, index (index)}
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							id="option-{index}"
							bind:value={listOfUsers[index]}
							on:change={handleUserChange}
							class="block py-2.5 px-0 w-full text-sm 
                 border-b-2 border-solid
                 text-gray-900 bg-transparent border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="option-{index}"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>User Address- {index}</label
						>
					</div>
				{/each}
			</div>

			<hr class="my-6" />

			{#if connected}
				<button
					on:click={createMultiSignature}
					class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
					>Create</button
				>
			{:else}
				<h6 class="text-center">Connect to Wallet.</h6>
			{/if}-->
			</form>
		{/if}
	</div>
</Card>
