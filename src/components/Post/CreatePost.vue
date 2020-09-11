<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6" offset-sm="3" class="text-center">
                <div class="secondary--text headline">Write new Post</div>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12">
                <form @submit.prevent="onCreatePost">
                    <v-row no-gutters>
                        <v-col cols="12" sm="6" offset-sm="3" >
                            <v-textarea
                                v-model="description"
                                :rules="[rules.required]"
                                label="Description"
                                id="Description"
                                type="text"
                                solo
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12" sm="6" offset-sm="3" >
                            <v-file-input
                            v-model="file"
                            label="File input"
                            filled
                            prepend-icon="mdi-camera"
                            @change="onFilePicked" >
                                <input type="file"  >
                            </v-file-input>
                        </v-col>
                    </v-row>
                     <v-row no-gutters>
                        <v-col cols="12" sm="6" offset-sm="3" >
                            <img :src="imageUrl" height="200px">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" offset-sm="3" class="grey lighten-4 text-center">
                            <v-btn large class="primary" :disabled="!formIsValid"
                            type="submit">Create Post</v-btn>
                        </v-col>
                    </v-row>
                </form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            file: null,
            imageUrl: '',
            description: '',
            date: new Date().toISOString().substr(0, 10),
            time: new Date().toTimeString().substr(0, 5),
            image: null,
            rules: {
            required: value => !!value || 'Required.',
            },
        }
    },
    computed: {
        formIsValid() {
         return   this.imageUrl !== '' && 
            this.description !== ''
        },
    },
    methods: {
        onCreatePost () {
            if (!this.formIsValid) {
                return
            }
            if(!this.image){
                return
            }
            const postData = {
                image: this.image,
                description: this.description,
                date: this.date,
                time: this.time,
                likes: 0,
            }
            this.$store.dispatch('createPost', postData)
            this.$router.push('/')
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