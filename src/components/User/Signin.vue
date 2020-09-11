<template>
    <v-container>
        <v-row v-if="error">
            <v-col cols="12" sm="6" offset-sm="3">
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12" sm="6" offset-sm="3">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <form @submit.prevent="onSignin">
                                <v-row no-gutters>
                                    <v-col cols="12">
                                        <v-text-field
                                            name="email"
                                            label="Mail"
                                            id="email"
                                            v-model="email"
                                            :rules="[rules.required]"
                                            type="email"
                                            filled="">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col cols="12">
                                        <v-text-field
                                            name="password"
                                            label="Password"
                                            id="password"
                                            v-model="password"
                                            :rules="[rules.required]"
                                            type="password"
                                            >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col cols="12">
                                         <v-btn type="submit" :disabled="loading" :loading="loading">Sign in
                                            <span slot="loader" class="custom-loader">
                                                <v-icon light>cached</v-icon>
                                            </span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            email: '',
            password: '',
            rules: {
            required: value => !!value || 'Required.',
            },
        }
    },
    computed: {
        user () {
            return this.$store.getters.user
        },
        error () {
            return this.$store.getters.error
        },
        loading () {
            return this.$store.getters.loading
        }
    },
    watch: {
        user (value) {
            if (value !== null && value !== undefined){
                this.$router.push('/')
            }
        }
    },
    methods: {
        onSignin () {
            this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
        },
        onDismissed () {
            this.$store.dispatch('clearError')
        }
    }
}
</script>