<script lang="ts">
    import {AppwriteService} from "$lib/appwrite";
    import {goto} from "$app/navigation";

    let registering = false;
    async function onRegister(){
        if (registering){return;}
        registering = true;

        try {
            await AppwriteService.createAccount();
            await goto('/casino');
        }
        catch (err: any){
            alert(err.message ? err.message : err)
        }
        finally {
            registering = false;
        }
    }
</script>

<button
        on:click={onRegister}
        class="flex items-center justify-center space-x-3 bg-brand-600 hover:bg-brand-500 text-white rounded-none px-10 py-3"
>
    {#if registering}
        <span>...</span>
    {/if}
    <span>Create anonymous account</span>
</button>