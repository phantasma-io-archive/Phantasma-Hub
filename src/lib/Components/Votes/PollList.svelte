<script lang="ts">
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import { singleVote } from '$lib/Components/Wallet/VoteCommands';
	import { PhantasmaLink } from 'phantasma-ts';
	import {
		Base16,
		ConsensusMode,
		hexStringToBytes,
		hexStringToUint8Array,
		hexToByteArray,
		PBinaryReader,
		PollChoice,
		PollState,
		PollValue,
		Serialization,
		stringToUint8Array,
		Timestamp,
		uint8ArrayToStringDefault,
		VMObject,
		type ConsensusPoll,
		type Organization
	} from 'phantasma-ts/src';
	import moment from 'moment';
	import bigInt from 'big-integer';
	import { beforeUpdate, onMount, tick } from 'svelte';
	import { DateTimeFormat, LinkWallet } from '$lib/store';
	import PollListItem from './PollListItem.svelte';
	export let polls: ConsensusPoll[] = [];
</script>

<Card
	size="xl"
	title="Consensus Poll List"
	description="All the consensus polls that are currently active."
>
	<div class="flex flex-col justify-between">
		{#each polls as poll}
			<div class="my-2">
				<PollListItem bind:id={poll.organization} {poll} />
			</div>
		{/each}
	</div>
</Card>
