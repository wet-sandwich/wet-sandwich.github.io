<script lang="ts">
  let { onclick, text } = $props();
</script>

<button
  {onclick}
  class="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded shadow-md cursor-pointer"
>
  {text}
</button>
