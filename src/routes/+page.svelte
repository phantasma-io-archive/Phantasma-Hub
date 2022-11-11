<script>
import Commands from "$lib/Commands.svelte";
import Wallet from "$lib/Wallet.svelte";
import Card from "$lib/Card/Card.svelte";
import APISelector from "$lib/Card/APISelector.svelte";
import ContractSelector from "$lib/Card/ContractSelector.svelte";
import TipMe from "$lib/Card/TipMe.svelte";
</script>



<div class="mb-4 px-6 mx-auto"> 

    <div class="flex flex-wrap -mx-3"> 
        <APISelector />
        <ContractSelector />
        <TipMe />
    </div>
    
    <div class="flex flex-wrap mt-6 -mx-3">
        <Card size="md" />
        <Card size="md" />
    </div>
    
    <div class="flex flex-wrap mt-6 -mx-3">
        <Card size="lg" />
        <Card size="sm" />
    </div>
    
    
    <div class="flex flex-wrap mt-6 -mx-3">
        <Card size="md" />
        <Card size="xs" />
        <Card size="xs" />
    </div>
    
    
    
    <div class="flex flex-wrap mt-6 -mx-3">
        <Card size="xl" title="Console" description="Contract Call output">
            <textarea class="w-full shadow-md bg-slate-200 border-r-2 rounded-2xl p-4" rows="10" id="contractMethodOutput"></textarea>
        </Card>
    </div>
    
</div>


<!-- <Wallet />-->

<!-- <Commands />-->