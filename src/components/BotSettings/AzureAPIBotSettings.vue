<template>
    <v-list-subheader>{{ bot.getBrandName() }}</v-list-subheader>
    <v-list-item>
        <v-list-item-title>{{ $t("azureApi.apiKey") }}</v-list-item-title>
        <v-list-item-subtitle>{{ $t("azureApi.apiKeyPrompt") }}</v-list-item-subtitle>
        <v-text-field
            v-model="azureApiKey"
            outlined
            dense
            placeholder=""
            @change="setAzureApiKey($event.target.value)"></v-text-field>
        <v-list-item-title>{{ $t("azureApi.apiEndpoint") }}</v-list-item-title>
        <v-list-item-subtitle>{{ $t("azureApi.apiEndpointPrompt") }}</v-list-item-subtitle>
        <v-text-field
            v-model="azureApiEndpoint"
            outlined
            dense
            placeholder=""
            @change="setAzureApiEndpoint($event.target.value)"></v-text-field>
        <v-list-item-title>{{ $t("azureApi.apiEngine") }}</v-list-item-title>
        <v-list-item-subtitle>{{ $t("azureApi.apiEnginePrompt") }}</v-list-item-subtitle>
        <v-text-field
            v-model="azureApiEngine"
            outlined
            dense
            placeholder=""
            @change="setAzureApiEngine($event.target.value)"></v-text-field>
    </v-list-item>
</template>
<script>
import { mapState , mapMutations} from "vuex";
import AzureAPIBot from "@/bots/AzureAPIBot";
export default {
    data(){
        return {
            bot: AzureAPIBot.getInstance()
        }
    },
    methods: {
        ...mapMutations(["setAzureApiKey"]),
        ...mapMutations(["setAzureApiEndpoint"]),
        ...mapMutations(["setAzureApiEngine"]),
    },
    computed: {
        ...mapState(["azureApiKey"]),
        ...mapState(["azureApiEndpoint"]),
        ...mapState(["azureApiEngine"]),
    }
}
</script>

<style>

</style>