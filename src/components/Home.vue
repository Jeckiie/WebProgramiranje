<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader
                type="image"
                v-if="loading">
                </v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row v-if="!loading && userIsAuthenticated">
            <v-col cols="12"
            v-for="post in posts.slice().reverse()"
            v-bind:key="post.id">
               <v-card
               class="mx-auto"
               max-width="800">
                <v-img contain :src="post.imageUrl">
                </v-img>
                <v-card-subtitle class="mb-4" >
                    <div style="position: absolute; left: 1%">{{post.date}} | {{post.time}} </div>
                    <v-icon medium style="position: absolute; right: 1%;cursor:pointer" @click.stop="deletePost(post.id)" v-if="creator(post.id)" >mdi-delete</v-icon>
                </v-card-subtitle>
                    
                <v-card-text class="text--primary">
                    <div style="font-size: 20px;">{{ post.description }}</div>
                </v-card-text>

                <v-card-actions>
                    <v-icon large right @click.stop="like(post.id, post.likes)" v-bind:style="isLiked(post.id) ? 'color: red;' : 'color: gray'">mdi-heart</v-icon>
                    <div style="margin-left: 5px">{{post.likes}}</div>
                    <v-spacer></v-spacer>
                    <v-avatar>
                        <v-img max-height="50px" max-width="50px" v-bind:src="post.profileImgUrl"></v-img>
                    </v-avatar>
                  <!-- <v-icon large right>mdi-account</v-icon> -->
                    <div style="margin-left: 5px">{{ post.author }}</div>
                </v-card-actions>

               </v-card>
            </v-col>
        </v-row>
        <v-row v-if="!loading && !userIsAuthenticated" class="text-center">
        <v-col cols="12">
                <h1 style="color: #1976d2;font-size:72px">Welcome</h1>
        </v-col>
            <v-col cols="12" sm="6" class="text-center text-sm-right pr-sm-2 mb-2">
                <v-btn large router to="/signup" class="info"><v-icon class="mr-1">face</v-icon>Sign up</v-btn>
            </v-col>
            <v-col cols="12" sm="6" class="text-center text-sm-left pl-sm-2 mb-2">
                <v-btn large router to="/signin" class="info"><v-icon class="mr-1">lock_open</v-icon>Sign in</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data (){
        return {
            postAuthor: '',
            imageUrl: '',
            liked: null,
        }
    },
    props: ['postId'],
    computed: {
        posts () {
            return this.$store.getters.loadedPosts
        },
        loading() {
            return this.$store.getters.loading
        },
        userIsAuthenticated () {
            return this.$store.getters.user !== null && this.$store.getters.user !== undefined
        },
    },
    methods: {
        onLoadPost (id) {
            this.$router.push('/posts/' + id)
        },
        like(id, likes) {
            const likeData = {
                id: id,
                likes: likes,
            }
            this.$store.dispatch("like", likeData)
        },
        isLiked(id){
            if(this.$store.getters.profile.likedPosts != null) {
                let x = this.$store.getters.profile.likedPosts.findIndex(function(element) {
                    return element == id
                })
                if(x > -1) {
                    return true
                } else {
                    return false
                }
            }    
        },
        deletePost(id){
            const data = {
                id: id,
            }
            this.$store.dispatch('deletePost', data)
        },
        creator(id){
            for(let x in this.$store.getters.profile.createdPosts){
                if(this.$store.getters.profile.createdPosts[x] == id){
                    return true
                }
            } 
        },
    }
}
</script>

<style scoped>
.title{
    position: absolute;
    right: 0%;
    color: gray
}
.is_red{
    color: red;
}
</style>