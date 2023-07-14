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
	import { IsPollCreated, LinkWallet, PhantasmaAPIClient } from '$lib/store';
	import type { type ConsensusPoll, Organization, PhantasmaAPI } from 'phantasma-ts/src';
	import PollList from '$lib/Components/Votes/PollList.svelte';

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe(async (value) => {
		api = value;
		await getOrganizations();
		await getPolls();
	});

	IsPollCreated.subscribe((isPollCreated) => {
		if (isPollCreated) {
			getPolls();
			getOrganizations();
		}
	});

	let polls: ConsensusPoll[] = [];
	let poll;

	let createPoll = false;

	let pollSelected: ConsensusPoll | null;

	async function getPolls() {
		polls = await getConsensusPolls();
	}

	async function getPoll(subject: string) {
		poll = await getConsensusPoll(subject);
	}

	let organizations: Organization[] = [];

	async function getOrganizations() {
		api.getOrganizations().then((orgs) => {
			organizations = orgs;
		});
	}

	function onPollChange(e) {}

	//getPoll('system.nexus.protocol.version');
	getOrganizations();
	getPolls();
</script>

<div class="mb-4 px-6 mx-auto">
	<h5>Votes</h5>

	<div class="flex flex-wrap -mx-3 justify-center">
		<!--<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">Consensus Polls</p>
					<h5 class="mb-0 font-normal text-sm">Select the consensus poll to interact.</h5>
				</div>
				<div>
					<select name="consensusPoll" bind:value={pollSelected} on:change={onPollChange}>
						<option value>No poll selected.</option>
						{#each polls as poll}
							<option value={poll}>
								{poll.subject}
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
						icon="material-symbols:how-to-vote-outline"
					/>
				</div>
			</div>
		</Card>-->
		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">
						Create Consensus Polls
					</p>
					<h5 class="mb-0 font-normal text-sm">Create a new Consensus Poll</h5>
				</div>
				<div>
					<button
						class:create-poll={!createPoll}
						class:close-poll={createPoll}
						class="rounded-md text-white p-2"
						on:click={() => (createPoll = !createPoll)}
					>
						{#if !createPoll}
							Create a new Poll
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
						icon="fluent:form-new-28-regular"
					/>
				</div>
			</div>
		</Card>
	</div>

	<div class="flex flex-wrap -mx-3 my-3">
		<!--{#if pollSelected && !createPoll}
			<PollDetails bind:poll={pollSelected} bind:id={pollSelected.subject} {organizations} />
		{/if}-->

		{#if createPoll}
			<CreatePoll {organizations} />
		{/if}
	</div>

	<div>
		<PollList bind:polls />
	</div>
</div>

<style>
	.create-poll {
		@apply bg-green-500;
	}

	.close-poll {
		@apply bg-red-500;
	}
</style>
