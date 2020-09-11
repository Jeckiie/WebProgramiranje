<template>
     <v-container>
        <v-row no-gutters>
            <v-col cols="12" >
                <form @submit.prevent="onUpdateProfile">
                <v-row>
                    <v-col cols="6" sm="4" style="border:solid 1px">
                        <v-img v-bind:src="getImageUrl"></v-img>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-file-input
                            v-model="file"
                            label="Add profile image"
                            filled
                            prepend-icon="mdi-camera"
                            @change="onFilePicked"
                        >
                        <input type="file"  >
                        </v-file-input>
                        <v-text-field 
                                v-model="username"
                                label="Set username"
                                id="username"
                                filled
                            ></v-text-field>
                            <v-btn large class="primary" :disabled="!formIsValid"
                            type="submit">Update profile</v-btn>
                    </v-col>
                </v-row>
                </form>
                <v-row>
                    <v-col cols="6" sm="4">
                        <h3>Username: {{ getUsername }}</h3>
                    </v-col>
                    <v-col>

                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            username: '',
            file: null,
            imageUrl: '',
            image: null,
        }
    },
    computed: {
        formIsValid() {
            return this.imageUrl !== '' || this.username !== ''
        },
        getUsername () {
            return this.$store.getters.profile.username
        },
        getImageUrl () {
                if(this.imageUrl){
                    return this.imageUrl
                } else {
                    return this.$store.getters.profile.imageUrl
                }
                
        }
    },
    methods: {
        onUpdateProfile () {
            if (!this.formIsValid) {
                return
            }
            if(this.image == null){
                this.$store.dispatch('updateProfileUsername', this.username)
            } else if(this.username == '') {
                this.$store.dispatch('updateProfileImage', this.image)
            } else if (this.image !== null && this.username !== '') {
                const profileData = {
                    image: this.image,
                    username: this.username,
                }
                this.$store.dispatch('updateProfileData', profileData)
            } else {
                return
            }
        },
        onFilePicked(){
            //this.file se odnosi na file jer je v-model="file"
            //filereader pretvara sliku u string kako bi je :src mogao pročitati
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(this.file)
            //sprema original sliku u image
            this.image = this.file
        }
    }
}
</script>