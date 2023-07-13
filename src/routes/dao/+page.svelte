<script lang="ts">
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import CreatePoll from '$lib/Components/Votes/CreatePoll.svelte';
	import PollDetails from '$lib/Components/Votes/PollDetails.svelte';
	import {
		getConsensusPoll,
		getConsensusPolls,
		initPoll
	} from '$lib/Components/Wallet/VoteCommands';
	import { LinkWallet, PhantasmaAPIClient } from '$lib/store';
	import type { ConsensusPoll, Organization, PhantasmaAPI } from 'phantasma-ts/src';
	import CreateDao from '$lib/Components/Dao/CreateDAO.svelte';
	import ManageDao from '$lib/Components/Dao/ManageDAO.svelte';

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe((value) => {
		api = value;
		getOrganizations();
	});

	let createDAO = false;
	let manageDAO = false;
	let selectedOrg: Organization | null;

	let organizations: Organization[] = [];
	let org_id = '';
	$: if (selectedOrg !== null) {
		org_id = selectedOrg?.id;
	}

	function getOrganizations() {
		api.getOrganizations().then((orgs) => {
			organizations = orgs;
		});
	}

	function onCreateDAO() {
		createDAO = !createDAO;
		if (manageDAO) manageDAO = !createDAO;
	}

	function onSelectedOrg(e) {
		console.log(selectedOrg);
		manageDAO = true;
		if (createDAO) createDAO = !manageDAO;

		if (e.target.value === null || e.target.value === '' || e.target.value === undefined) {
			selectedOrg = null;
			manageDAO = false;
		}
	}

	getOrganizations();
</script>

<div class="mb-4 px-6 mx-auto">
	<h5>DAO's</h5>

	<div class="flex flex-wrap -mx-3">
		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">Create DAO</p>
					<h5 class="mb-0 font-normal text-sm">Create a DAO.</h5>
				</div>
				<div>
					<button
						class:create-dao={!createDAO}
						class:close-dao={createDAO}
						class="rounded-md text-white p-2"
						on:click={onCreateDAO}
					>
						{#if !createDAO}
							Create a new DAO
						{:else}
							Close
						{/if}
					</button>
				</div>
			</div>
			<div class="px-3 text-right basis-1/3">
				<div
					class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
				>
					<Icon
						height="18"
						width="18"
						class="text-lg relative top-2.5 text-white"
						icon="clarity:employee-group-line"
					/>
				</div>
			</div>
		</Card>

		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">Manage DAO</p>
					<h5 class="mb-0 font-normal text-sm">Manage the DAO</h5>
				</div>
				<div>
					<select
						name="manageDAO"
						bind:value={selectedOrg}
						on:change={onSelectedOrg}
						class="text-black p-4 text-sm"
					>
						<option value selected>No organization selected.</option>
						{#each organizations as org}
							<option value={org}>
								{org.name}
							</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="px-3 text-right basis-1/3">
				<div
					class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
				>
					<Icon
						height="18"
						width="18"
						class="text-lg relative top-2.5 text-white"
						icon="carbon:group-presentation"
					/>
				</div>
			</div>
		</Card>
	</div>

	<div class="flex flex-wrap -mx-3 my-3">
		{#if createDAO && !manageDAO}
			<CreateDao />
		{/if}

		{#if !createDAO && manageDAO}
			<ManageDao organization_id={org_id} organization={selectedOrg} />
		{/if}
	</div>
</div>

<style>
	.create-dao {
		@apply bg-green-500;
	}

	.close-dao {
		@apply bg-red-500;
	}
</style>
