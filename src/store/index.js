import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedPosts: [
      { imageUrl: '', 
      id: '',
      date: '',
      time: '',
      likes: 0,
      description: ''},
    ],
    user: null,
    loading: false,
    error: null,
    key: null,
    profile:  {
      username: null,
      imageUrl: '',
      profileKey: null,
      likedPosts: [],
      createdPosts: [],
    },
  },
  mutations: {
    setLoadedPosts(state, payload) {
      state.loadedPosts = payload
    },
    createPost (state, payload) {
      state.loadedPosts.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    saveKey (state, payload){
      state.key = payload
    },
    setProfile(state, payload) {
      state.profile = payload
    },
  },
  actions: {
    loadPosts ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('posts').once('value')
      .then(
        (data) => {
          const posts = []
          const obj = data.val()
          for (let key in obj) {
            posts.push({
              id: key,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              date: obj[key].date,
              time: obj[key].time,
              creatorId: obj[key].creatorId,
              author: obj[key].author,
              profileImgUrl: obj[key].profileImgUrl,
              likes: obj[key].likes,
            })
          }
          commit('setLoadedPosts', posts)
          commit('setLoading', false)
        })
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deletePost({commit, getters}, payload){
      let createdPosts = getters.profile.createdPosts
      let x = createdPosts.findIndex(function(element) {
        return element == payload.id
      })
      if(x > -1){
        createdPosts.splice(x, 1)
      }
      const deleteData = {
        postKey: payload,
        newCreatedPosts: createdPosts,
      }
      async function postDelete(deleteData){
        let promiseDeletePost = firebase.database().ref('posts').child(deleteData.postKey.id).remove()
        .then(() => {
          const newProfile = {
            username: getters.profile.username,
            imageUrl: getters.profile.profileImgUrl,
            profileKey: getters.profile.profileKey,
            likedPosts: getters.profile.likedPosts,
            createdPosts: deleteData.newCreatedPosts,
          }
          commit("setProfile", newProfile)
        })
        .catch(
          error => {
            console.log(error)
        })
        await promiseDeletePost

        let promiseRemoveCreatedPosts = firebase.database().ref('profiles').child(getters.profile.profileKey).update({createdPosts: deleteData.newCreatedPosts})
        .then(
        )
        .catch(
          (error) => {
            console.log(error)
        })
        await promiseRemoveCreatedPosts

        let removePostFromLikedPosts = firebase.database().ref('profiles').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              for(let post in obj[key].likedPosts){
                if(obj[key].likedPosts[post] == deleteData.postKey.id){
                  let path = 'profiles/' + key + '/likedPosts/' + post
                  firebase.database().ref(path).remove()
                  .then(
                  )
                  .catch((error) => {console.log(error)})
                }
              }
            }
          })
        .catch(
          (error) => {
            console.log(error)
        })
        await removePostFromLikedPosts
      }
      postDelete(deleteData)
 
    },
    like({commit, getters}, payload){
      let likedPosts = getters.profile.likedPosts
      const postKey = payload.id
      const likes = payload.likes
      let changeLikesBy = 0
      if(likedPosts == null){
        likedPosts = [postKey]
        changeLikesBy = 1
      } else {
        let x = likedPosts.findIndex(function(element) {
          return element == postKey
        })
        if(x > -1){
          likedPosts.splice(x, 1)
          changeLikesBy = -1
        } else {
          likedPosts.push(postKey)
          changeLikesBy = 1
        }
      }
      getters.loadedPost(postKey).likes = likes + changeLikesBy
      async function PostLike(newLikedPosts){
        let promiseGetKey = firebase.database().ref('profiles').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(getters.user.id == obj[key].userKey){
                return key
              }
            }
          })
        .catch(
          (error) => {
            console.log(error)
        })
        let key = await promiseGetKey

        
        let promiseUpdateNoOfLikes = firebase.database().ref('posts').child(postKey).update({likes: likes + changeLikesBy})
        .then()
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdateNoOfLikes

        let promiseUpdateLikedPosts = firebase.database().ref('profiles').child(key).update({likedPosts: newLikedPosts})
        .then((data) => {
          const newProfile = {
          username: getters.profile.username,
         // imageUrl: getters.profile.profileImgUrl,
          imageUrl: data.val()[key].profileImgUrl,
          profileKey: key,
          likedPosts: newLikedPosts,
          createdPosts: getters.profile.createdPosts,
          }
          commit('setProfile', newProfile)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdateLikedPosts

      }
      PostLike(likedPosts)
    },
    updateProfileImage({commit, getters}, payload){
      const image = payload
      const userKey = getters.user.id
      async function PostProfileImage(image){
        let promiseGetKey = firebase.database().ref('profiles').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(userKey == obj[key].userKey){
                return key
              }
            }
          })
        .catch(
          (error) => {
            console.log(error)
        })
        let key = await promiseGetKey
        const fileName = image.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))

        let promiseDeletePrevoiusImage = firebase.storage().ref().child('profiles/' + key + ext).delete()
        .then()
        .catch(
          error => {
            console.log(error)
          }
        )
        await promiseDeletePrevoiusImage

        let promiseUploadImg = firebase.storage().ref('profiles/' + key + ext).put(image)
        .then(uploadTastSnapshot => {
          return uploadTastSnapshot.ref.getDownloadURL()
        })
        let url = await promiseUploadImg

        let promiseUpdateImage = firebase.database().ref('profiles').child(key).update({profileImgUrl: url})
        .then(() => {
          const newProfile = {
            username: getters.profile.username,
            imageUrl: url,
            profileKey: key,
            likedPosts: getters.profile.likedPosts,
            createdPosts: getters.profile.createdPosts,
          }
          commit('setProfile', newProfile)
          commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdateImage

        let promiseUpdatePostImg = firebase.database().ref('posts').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(userKey == obj[key].creatorId){
                firebase.database().ref('posts').child(key).update({profileImgUrl: url})
                .then()
                .catch((error) => {
                  console.log(error)
              })
              }
            }
            commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdatePostImg
      }
      PostProfileImage(image)
    },
    updateProfileUsername({commit, getters}, payload){
      const username = payload
      const userKey = getters.user.id
      async function PostProfileUsername(profileUsername){
        let promiseGetKey = firebase.database().ref('profiles').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(userKey == obj[key].userKey){
                return key
              }
            }
            commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        let profileKey = await promiseGetKey

        let promiseUpdateUsername = firebase.database().ref('profiles').child(profileKey).update({username: profileUsername})
        .then(() => {
          const newProfile = {
            username: profileUsername,
            imageUrl: getters.profile.imageUrl,
            profileKey: profileKey,
            likedPosts: getters.profile.likedPosts,
            createdPosts: getters.profile.createdPosts,
          }
          commit('setProfile', newProfile)
          commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdateUsername

        let promiseUpdatePostUsername = firebase.database().ref('posts').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(userKey == obj[key].creatorId){
                firebase.database().ref('posts').child(key).update({author: profileUsername})
                .then()
                .catch((error) => {
                  console.log(error)
              })
              }
            }
            commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdatePostUsername
      }
      PostProfileUsername(username)
    },
    updateProfileData ({commit, getters}, payload) {
      const profileData = {
        username: payload.username,
        image: payload.image,
        userKey: getters.user.id,
        likedPosts: getters.profile.likedPosts,
        createdPosts: getters.profile.createdPosts,
      }
      async function PostProfileData(profileData){
        let promiseGetKey = firebase.database().ref('profiles').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(profileData.userKey == obj[key].userKey){
                return key
              }
            }
            commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        let key = await promiseGetKey
        const fileName = payload.image.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))

        let promiseDeletePrevoiusImage = firebase.storage().ref().child('profiles/' + key + ext).delete()
        .then()
        .catch(
          error => {
            console.log(error)
          }
        )

        await promiseDeletePrevoiusImage

        let promiseUploadImg = firebase.storage().ref('profiles/' + key + ext).put(payload.image)
        .then(uploadTastSnapshot => {
          return uploadTastSnapshot.ref.getDownloadURL()
        })
        let url = await promiseUploadImg
        

        let promiseUpdateProfile = firebase.database().ref('profiles').child(key).update({username: profileData.username, profileImgUrl: url})
        .then(() => {
          const newProfile = {
            username: profileData.username,
            imageUrl: url,
            profileKey: key,
            likedPosts: profileData.likedPosts,
            createdPosts: profileData.createdPosts,
          }
          commit('setProfile', newProfile)
          commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdateProfile

        let promiseUpdatePostProfileData = firebase.database().ref('posts').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(profileData.userKey == obj[key].creatorId){
                firebase.database().ref('posts').child(key).update({author: profileData.username, profileImgUrl: url})
                .then()
                .catch((error) => {
                  console.log(error)
              })
              }
            }
            commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseUpdatePostProfileData
      }
      PostProfileData(profileData)
    },
    createPost ({commit, getters}, payload){
      const post = {
        description: payload.description,
        date: payload.date,
        time: payload.time,
        likes: payload.likes,
        creatorId: getters.user.id
      }
      async function PostPost(postData) {
        let promise = firebase.database().ref('posts').push(post)
        .then(data => {
          const key = data.key;
          commit('saveKey', key);
          return key;
        })
        let key = await promise
        const fileName = payload.image.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))

        let promiseUploadImg = firebase.storage().ref('post/' + key + ext).put(payload.image)
        .then(uploadTastSnapshot => {
          return uploadTastSnapshot.ref.getDownloadURL()
        })
        let url = await promiseUploadImg

        let promiseAddAuthorAndImg = firebase.database().ref('profiles').once('value')
        .then(
          (data) => {
            const obj = data.val()
            for (let key in obj) {
              if(postData.creatorId == obj[key].userKey){
                const profileData = {
                  username: obj[key].username,
                  profileImgUrl: obj[key].profileImgUrl,
                  profileKey: key
                }
                return profileData
              }
            }
          })
        .catch(
          (error) => {
            console.log(error)
        })
        let profileData = await promiseAddAuthorAndImg

        let promiseUpdatePost = firebase.database().ref('posts').child(key).update({imageUrl: url, author: profileData.username, profileImgUrl: profileData.profileImgUrl})
        .then(() => {
          commit('createPost', {
            ...postData,
            imageUrl: url,
            id: key,
            author: profileData.username,
            profileImgUrl: profileData.profileImgUrl,
          })
        })
        .catch(
          error => {
            console.log(error)
          }
        )
        await promiseUpdatePost
        let newCreatedPosts = null
        if(getters.profile.createdPosts == null) {
          newCreatedPosts = [key]
        } else {
          newCreatedPosts = getters.profile.createdPosts.push(key)
        }
        
        let promiseAddCreatedPosts = firebase.database().ref('profiles').child(profileData.profileKey).update({createdPosts: newCreatedPosts})
        .then(() => {
          const newProfile = {
          username: getters.profile.username,
          imageUrl: getters.profile.profileImgUrl,
          profileKey: key,
          likedPosts: getters.profile.likedPosts,
          createdPosts: newCreatedPosts,
          }
          commit('setProfile', newProfile)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
        })
        await promiseAddCreatedPosts
      }
      PostPost(post)
    },
    signUserUp ({commit}, payload) {
      const signupData = {
        email: payload.email, 
        password: payload.password, 
        username: payload.username,
      }
      async function postSignUp(signUpData) {
        let promise = firebase.auth().createUserWithEmailAndPassword(signUpData.email, signUpData.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid
            }
            commit('setUser', newUser)
            return user.user.uid
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
        let userUid = await promise
        
        let promiseGetDefImgUrl = firebase.storage().ref().child('profiles/xd').getDownloadURL()
        .then(

        )
        .catch(
          error => {
            console.log(error)
          }
        )

        let defImgUrl = await promiseGetDefImgUrl

        let promiseSaveProfile = firebase.database().ref('profiles').push({username: signUpData.username, profileImgUrl: defImgUrl, userKey: userUid, likedPosts: []})
        .then(data => {
          const key = data.key;
          const newProfile = {
            username: signUpData.username,
            imageUrl: defImgUrl,
            profileKey: key,
            likedPosts: [],
          }
          commit('setProfile', newProfile)
          return key
        })
        .catch(
          error => {
            console.log(error)
          }
        )
        await promiseSaveProfile
        commit('setLoading', true)
        let promiseGetPosts = firebase.database().ref('posts').once('value')
        .then(
          (data) => {
            const posts = []
            const obj = data.val()
            for (let key in obj) {
              posts.push({
                id: key,
                imageUrl: obj[key].imageUrl,
                description: obj[key].description,
                date: obj[key].date,
                time: obj[key].time,
                creatorId: obj[key].creatorId,
                author: obj[key].author,
                profileImgUrl: obj[key].profileImgUrl,
                likes: obj[key].likes,
              })
            }
            commit('setLoadedPosts', posts)
            commit('setLoading', false)
          })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
          })
        await promiseGetPosts;
      }
      postSignUp(signupData)
    },
    signUserIn ({commit}, payload) {
      const signInData = {
        email: payload.email,
        password: payload.password,
      }
      commit('setLoading', true)
      commit('clearError')
      async function postSignIn(signInData) {
      let promise = firebase.auth().signInWithEmailAndPassword(signInData.email, signInData.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
          }
          console.log(newUser)
          commit('setUser', newUser)
          return user.user.uid
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
      let userUid = await promise
      
      let promiseGetProfileData = firebase.database().ref('profiles').once('value')
      .then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            if(userUid == obj[key].userKey){
              const newProfile = {
                username: obj[key].username,
                imageUrl: obj[key].profileImgUrl,
                profileKey: key,
                likedPosts: obj[key].likedPosts,
                createdPosts: obj[key].createdPosts,
              }
              commit('setProfile', newProfile)
              return
            }
          }
          commit('setLoading', false)
        })
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading', false)
      })
      await promiseGetProfileData
      commit('setLoading', true)
      let promiseGetPosts = firebase.database().ref('posts').once('value')
      .then(
        (data) => {
          const posts = []
          const obj = data.val()
          for (let key in obj) {
            posts.push({
              id: key,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              date: obj[key].date,
              time: obj[key].time,
              creatorId: obj[key].creatorId,
              author: obj[key].author,
              profileImgUrl: obj[key].profileImgUrl,
              likes: obj[key].likes,
            })
          }
          commit('setLoadedPosts', posts)
          commit('setLoading', false)
        })
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading', false)
        })
      await promiseGetPosts;
      }
      postSignIn(signInData)
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', {id: payload.uid})
      firebase.database().ref('profiles').once('value')
      .then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            if(payload.uid == obj[key].userKey){
              const newProfile = {
                username: obj[key].username,
                imageUrl: obj[key].profileImgUrl,
                profileKey: key,
                likedPosts: obj[key].likedPosts,
                createdPosts: obj[key].createdPosts
              }
              commit('setProfile', newProfile)
              return
            }
          }
          commit('setLoading', false)
        })
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    logout ({commit}){
      firebase.auth().signOut()
      commit('setUser', null)
      const newProfile = {
        username: '',
        imageUrl: '',
        profileKey: null,
        likedPosts: [],
        createdPosts: [],
      }
      commit('setProfile', newProfile)
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  modules: {
  },
  getters: {
    loadedPosts (state) {
      return state.loadedPosts.sort((postA, postB) => {
        return postA.date > postB.date
      })
    },
    loadedPost (state) {
      return (postId) => {
        return state.loadedPosts.find((post) => {
          return post.id == postId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    profile (state) {
      return state.profile
    },
  }
})
