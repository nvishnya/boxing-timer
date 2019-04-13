<template>
    <v-btn icon flat @click="$emit('edit-time')">
        <v-icon class="icon">
            {{ arrowIcon }}
        </v-icon>
    </v-btn> 
</template>

<script>
export default {
    props: {
        arrowIcon: String
    }
}
</script>
