<script lang="ts">
	import { AllContracts } from '$lib/store';
	import { IncreaseContractStorage } from '../Contract/ContractCommands';
	import Notification from '../Notification/Notification.svelte';
	import { NotificationError } from '../Notification/NotificationsBuilder';
	import Modal from './Modal.svelte';
	import { ModalType } from './ModalType';
	import { createEventDispatcher, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	export let owner = '';
	export let selectContract = '';
	export let contractAddress = '';
	let amount = 0;
	let sizeType = 'Kb';
	let contracts: Array<string>;
	let soulNeededToStake = 0;
	AllContracts.subscribe((value) => {
		contracts = value;
	});

	const KB_IN_MB = 1024;
	const KB_IN_GB = 1024 * 1024;
	const SOUL_PER_KB = 1 / 40;

	function onStake() {}

	function IncreaseStorage(storageAmount: number, storageType: string) {
		console.log(storageAmount);
		console.log(storageType);

		soulNeededToStake = 0;

		switch (storageType) {
			case 'Kb':
				soulNeededToStake = storageAmount * SOUL_PER_KB;
				break;
			case 'Mb':
				soulNeededToStake = storageAmount * KB_IN_MB * SOUL_PER_KB;
				break;
			case 'Gb':
				soulNeededToStake = storageAmount * KB_IN_GB * SOUL_PER_KB;
				break;
			default:
				soulNeededToStake = 2;
				break;
		}

		console.log(soulNeededToStake);
	}

	function onExecute() {
		console.log('send');
		IncreaseStorage(amount, sizeType);
		IncreaseContractStorage(contractAddress, soulNeededToStake * 10 ** 8);
	}

	function UpdateAmount() {
		IncreaseStorage(amount, sizeType);
	}
</script>

<Modal title="Increase Storage on Contract" modalType={ModalType.Custom} on:close={close}>
	<div class="p-6 space-y-6 w-full">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="method"
						id="method"
						value={contractAddress}
						class="block text-center py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
						disabled
					/>
					<label
						for="method"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Contract Address</label
					>
				</div>
			</div>
			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="number"
						name="method"
						id="method"
						bind:value={amount}
						on:change={UpdateAmount}
						on:keypress={UpdateAmount}
						on:keyup={UpdateAmount}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="method"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Storage Size</label
					>
				</div>
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="contract"
						id="contract"
						bind:value={sizeType}
						on:change={UpdateAmount}
						on:keypress={UpdateAmount}
						on:keyup={UpdateAmount}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					>
						<option value="Kb" selected>Kb</option>
						<option value="Mb">Mb</option>
						<option value="Gb">Gb</option>
					</select>
					<label
						for="organization"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Storage Size Type</label
					>
				</div>
			</div>
		</form>
	</div>

	<div class="px-6 w-full">
		<h5 class="text-sm text-center">SOUL needed for this storage amount.</h5>
		<p class="text-md text-center">
			{soulNeededToStake} SOUL
		</p>
	</div>

	<!-- Modal footer -->
	<div
		class="flex items-center p-6 space-x-2 rounded-b border-t justify-center border-gray-200 dark:border-gray-600"
	>
		<button
			class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			on:click={onExecute}>Execute</button
		>
		<!--<button
			class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			on:click={onStake}>Stake</button
		>-->
		<button
			type="button"
			class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
			on:click={close}>Cancel</button
		>
	</div>
</Modal>
