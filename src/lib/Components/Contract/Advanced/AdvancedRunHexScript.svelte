<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { consoleOutput, contractMethod, contractName } from '$lib/store';
	import { Base16, type ABIMethod, type ABIParameter } from 'phantasma-ts/core';
	import { DecodeInformation, DecodeStruct, FormatData } from '$lib/Commands/Commands';
	import {
		InvokeRawScript,
		SendRawTransaction
	} from '$lib/Components/Contract/Advanced/AdvancedCommands';
	let script: string = '';

	function invokeRawScript() {
		let result = InvokeRawScript(script, (result) => {
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
				consoleOutput.set(JSON.stringify(resultsArray, null, 2));
			} catch (e) {
				console.log('error: ', e);
				consoleOutput.set(JSON.stringify(result, null, 2));
			}
		});
	}

	function sendRawTransaction() {
		SendRawTransaction(
			script,
			(result) => {
				// Get Transaction Result by Hash
				console.log(result);
				consoleOutput.set(JSON.stringify(result, null, 2));
			},
			(error) => {
				console.log(error);
			}
		);
	}
</script>

<Card
	size="xl"
	title="Contract Arguments"
	description="Fill in the contract arguments to call make the call to the contract."
>
	<div class="my-1">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols md:gap-6">
				<textarea
					class="w-full shadow-md bg-slate-200 border-r-2 rounded-2xl p-4"
					rows="10"
					id="contractMethodOutput"
					placeholder="Enter your script here"
					bind:value={script}
				/>
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
		</form>
	</div>
</Card>
