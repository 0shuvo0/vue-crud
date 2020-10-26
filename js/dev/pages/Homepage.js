import { getPosts } from "../utils.js"

import { Card } from "../components/Card.js";
import { AddPostModal } from "../components/AddPostModal.js"


export var Homepage = Vue.component('home-page', {
	data(){
		return {
			showCreateModal: false,
			posts: []
		}
	},
	mounted(){
		this.posts = getPosts()
	},
	methods: {
		refresh(){
			this.posts = getPosts()
			this.showCreateModal = false
		}
	},
	template: `
	<div>
		<p class="text-right pb-3">
			<button class="btn" @click="showCreateModal = true">add post</button>
		</p>
		<div>
			<card v-for="(post, index) in posts" :key="index" :post="post" @change="refresh()"></card>
			<h2 class="light-text text-center" v-if="posts.length < 1">No Posts Yet.</h2>
		</div>
		<AddPostModal :showCreateModal="showCreateModal" @close="showCreateModal = false" @added="refresh"></AddPostModal>
	</div>
	`
});