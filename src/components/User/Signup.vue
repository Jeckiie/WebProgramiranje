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
                            <form @submit.prevent="onSignup">
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
                                            name="username"
                                            label="Username"
                                            id="username"
                                            v-model="username"
                                            :rules="[rules.required]"
                                            type="text">
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
                                        <v-text-field
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            id="confirmPassword"
                                            v-model="confirmPassword"
                                            :rules="[rules.equalsPass]"
                                            type="password"
                                            >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col cols="12">
                                        <v-btn type="submit" :disabled="loading" :loading="loading">Sign up
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
            username: '',
            password: '',
            confirmPassword: '',
            rules: {
            required: value => !!value || 'Required.',
            equalsPass: value => value == this.password || 'Passwords do not match'
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
                this.$router.push('/profile')
            }
        }
    },
    methods: {
        onSignup () {
            if(this.username != ''){
                if ((this.password != this.confirmPassword)) {
                    alert("Passwords do not match!")
                } else {
                    this.$store.dispatch('signUserUp', {email: this.email, username: this.username, password: this.password})
                }
            } else {
                alert("Username is empty!")
            }
        },
        onDismissed () {
            this.$store.dispatch('clearError')
        }
    }
}
</script>