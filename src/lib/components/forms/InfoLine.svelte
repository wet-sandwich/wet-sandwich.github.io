<script lang="ts">
  interface Props {
    name: string;
    value: string;
  }
  let { name, value }: Props = $props();
</script>

<div class="flex items-baseline gap-2">
  <span class="font-semibold">{name}</span>
  <span class="flex-1 border-b border-solid border-gray-300" aria-hidden="true"></span>
  <span>{value}</span>
</div>
