<script lang="ts">
  let { onclick, text } = $props();
</script>

<button
  {onclick}
  class="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded shadow-md cursor-pointer"
>
  {text}
</button>
