<script setup>
defineProps({
    headers: { type: Array, required: true }, // [{title: 'ID', key: 'id'}, ...]
    items: { type: Array, required: true }
});

// Función para resolver claves anidadas como "businessLine.name"
const getValue = (item, key) => {
    if (!key) return null;
    // Divide la cadena por el punto y navega por el objeto
    return key.split('.').reduce((obj, i) => (obj ? obj[i] : null), item);
};
</script>

<template>
    <v-table fixed-header striped="odd" hover density="compact" class="my-4">
        <thead>
            <tr>
                <th v-for="header in headers" :key="header.key" class="text-left">
                    {{ header.title }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
                <td v-for="header in headers" :key="header.key">
                    <slot :name="header.key" :item="item">
                        {{ getValue(item, header.key) }}
                    </slot>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>