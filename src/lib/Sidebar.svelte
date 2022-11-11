<script>
  import Icon from '@iconify/svelte';
  import Item from '$lib/Sidebar/Sidebar-Item.svelte';
  import {apiStatus, leftSidebarMenu} from '$lib/store';
  let status;
  let leftSideNavBarActive;

  leftSidebarMenu.subscribe(value =>{
    leftSideNavBarActive = value;
  });
  
  function leftSideNavTrigger(){
    leftSidebarMenu.set(!leftSideNavBarActive);
  }

  apiStatus.subscribe(value => {
    status = value;
  });
</script>
<!-- sidenav  -->
<aside 
  class:translate-x-0={leftSideNavBarActive}
  class:shadow-soft-xl={leftSideNavBarActive}
  
  class="max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent">
    <div class="h-19.5">
        {#if leftSideNavBarActive}
          <a href="#" class="absolute top-0 right-0 p-4 opacity-50 cursor-pointer text-slate-400" on:click={leftSideNavTrigger}>
            <Icon height="16" width="16" icon="fa-close" />
          </a>
        {/if}
        <a class="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" href="#">
          <img src="SOUL.png" class="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8" alt="main_logo" />
          <span class="ml-1 font-semibold transition-all duration-200 ease-nav-brand">Contract Tester</span>
        </a>
    </div>

    <hr class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

    <h6 class="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-70">API Status</h6>
    <div class="h-12 mb-4 shadow-md text-sm ease-nav-brand my-0 mx-4 flex items-center rounded-lg font-semibold text-slate-700 transition-colors bg-opacity-90 
    {status ? 'bg-green-200' : 'bg-red-200'}" >
      <span class="px-8">
        Not connected
      </span>
    </div>

    <h6 class="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-70">Wallet Status</h6>

    <div class="h-12 mb-4 shadow-md text-sm ease-nav-brand my-0 mx-4 flex rounded-lg font-semibold text-slate-700 transition-colors bg-opacity-90 items-center 
    {status ? 'bg-green-200' : 'bg-red-200'}" >
      <span class="px-8">
        Not connected
      </span>
    </div>

    <hr class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />


    <div class="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
      <ul class="flex flex-col pl-0 mb-0">

        <Item title="API" link="/" icon="mdi:wallet" page="home"/>
        <Item title="Select Contract" link="/" icon="mdi:wallet" page="home2"/>
        <Item title="Send / Stake Tokens" link="/" icon="mdi:wallet" page="home3"/>
        <Item title="Change Owner" link="/" icon="mdi:wallet" page="home4"/>
        <Item title="Decode Information" link="/" icon="mdi:wallet" page="home5"/>
        <Item title="Get Transaction By Hash" link="/" icon="mdi:wallet" page="home5"/>

        
        <!-- <li class="w-full mt-4">
          <h6 class="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60">Account pages</h6>
        </li>-->

        
      </ul>
    </div>

    <!--<div class="mx-4">
      <div class="after:opacity-65 after:bg-gradient-to-tl after:from-slate-600 after:to-slate-300 relative flex min-w-0 flex-col items-center break-words rounded-2xl border-0 border-solid border-blue-900 bg-white bg-clip-border shadow-none after:absolute after:top-0 after:bottom-0 after:left-0 after:z-10 after:block after:h-full after:w-full after:rounded-2xl after:content-['']" sidenav-card>
        <div class="mb-7.5 absolute h-full w-full rounded-2xl bg-cover bg-center" style="background-image: url('../assets/img/curved-images/white-curved.jpeg')"></div>
        <div class="relative z-20 flex-auto w-full p-4 text-left text-white">
          <div class="transition-all duration-200 ease-nav-brand">
            <h6 class="mb-0 text-white">Wallet Information</h6>
            <p class="mt-0 mb-4 font-semibold leading-tight text-xs">Please check our docs</p>
            <a href="https://www.creative-tim.com/learning-lab/tailwind/html/quick-start/soft-ui-dashboard/" target="_blank" class="inline-block w-full px-8 py-2 mb-0 font-bold text-center text-black uppercase transition-all ease-in bg-white border-0 border-white rounded-lg shadow-soft-md bg-150 leading-pro text-xs hover:shadow-soft-2xl hover:scale-102">Documentation</a>
          </div>
        </div>
      </div>
    </div>-->

    
  </aside>

  <!-- end sidenav -->