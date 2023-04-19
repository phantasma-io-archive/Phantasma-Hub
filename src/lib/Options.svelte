<script lang="ts">
	import Icon from '@iconify/svelte';
	import { GasLimit, GasPrice, rightSidebarMenu, TipActive } from '$lib/store';
	import { onMount } from 'svelte';
	import Notification from './Components/Notification/Notification.svelte';
	import { NotificationSuccess } from './Components/Notification/NotificationsBuilder';
	let rightSideNavBarActive: boolean;

	let gasPrice: number;
	let lastGasPrice: number;
	GasPrice.subscribe((value) => {
		gasPrice = value;
	});

	let gasLimit: number;
	let lastGasLimit: number;
	GasLimit.subscribe((value) => {
		gasLimit = value;
	});

	let developerTip: boolean = true;
	TipActive.subscribe((value) => {
		console.log('TipActive', value);
		developerTip = value;
	});

	rightSidebarMenu.subscribe((value) => {
		rightSideNavBarActive = value;
	});

	function rightSideNavTrigger() {
		rightSidebarMenu.set(!rightSideNavBarActive);
	}

	function onDeveloperTipChange() {
		TipActive.set(developerTip);
	}

	function setGasPrice() {
		GasPrice.set(gasPrice);
		if (lastGasPrice && gasPrice != lastGasPrice)
			NotificationSuccess('Gas Price', 'Gas Price has been updated to ' + gasPrice + ' KCAL');
		lastGasPrice = gasPrice;
	}

	function setGasLimit() {
		GasLimit.set(gasLimit);
		if (lastGasLimit && gasLimit != lastGasLimit)
			NotificationSuccess('Gas Limit', 'Gas Limit has been updated' + gasLimit + ' KCAL');

		lastGasLimit = gasLimit;
	}
</script>

<div class="fixed-plugin">
	<!-- <a
		href="#"
		class="bottom-7.5 right-7.5 text-xl z-990 shadow-soft-lg rounded-circle fixed cursor-pointer bg-white px-4 py-2 text-slate-700 fixed-plugin-button"
		on:click={rightSideNavTrigger}
	>
		<Icon heiclass="py-2 pointer-events-none" icon="fa-cog" />
	</a>-->
	<!-- -right-90 in loc de 0-->
	<div
		class:-right-90={!rightSideNavBarActive}
		class="z-sticky shadow-soft-3xl w-90 ease-soft fixed top-0 left-auto flex h-full right-0 min-w-0 flex-col break-words rounded-none border-0 bg-white bg-clip-border px-2.5 duration-200"
	>
		<div class="px-6 pt-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
			<div class="float-left">
				<h5 class="mt-4 mb-0">Options</h5>
				<p>Options Menu.</p>
			</div>
			<div class="float-right mt-6">
				<button
					on:click={rightSideNavTrigger}
					class="inline-block p-0 mb-4 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 active:opacity-85 text-slate-700"
				>
					<Icon icon="fa-close" />
				</button>
			</div>
			<!-- End Toggle Button -->
		</div>
		<hr
			class="h-px mx-0 my-1 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
		/>
		<div class="flex-auto p-6 pt-0 sm:pt-4">
			<div>
				<h6 class="mb-0">Gas Configuration</h6>
			</div>
			<div class="grid mt-3 w-full">
				<div class="grid md:grid-cols mb-6 md:gap-6">
					<div class="relative z-0 w-full group">
						<input
							type="number"
							name="gasPrice"
							id="gasPrice"
							bind:value={gasPrice}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder="Gas Price"
							on:keydown={setGasPrice}
							required
						/>
						<label
							for="gasPrice"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Gas Price</label
						>
					</div>
				</div>

				<div class="grid md:grid-cols md:gap-6">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="number"
							name="gasLimit"
							id="gasLimit"
							bind:value={gasLimit}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder="Gas Limit"
							on:keydown={setGasLimit}
							required
						/>
						<label
							for="gasLimit"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Gas Limit</label
						>
					</div>
				</div>
			</div>

			<hr
				class="h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent sm:my-6"
			/>

			<div class="absolute bottom-8">
				<div class="mt-4">
					<h6 class="mb-0">Developer Fees</h6>
				</div>
				<div class="min-h-6 mb-0.5 block pl-0 ">
					<input
						bind:value={developerTip}
						bind:checked={developerTip}
						on:change={onDeveloperTipChange}
						class="rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left mt-1 ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
						type="checkbox"
					/>
				</div>
			</div>
		</div>
	</div>
</div>
