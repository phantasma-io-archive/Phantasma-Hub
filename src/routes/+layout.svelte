<script>
  import Sidebar from "$lib/Sidebar.svelte";
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
  import Options from "$lib/Options.svelte";
  import "../app.css";
  import "../soft-ui-dashboard-tailwind.min.css"
</script>

<Sidebar />

<main class="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200">
    <Header />

    <slot></slot>

    <Footer />
</main>

<Options />

