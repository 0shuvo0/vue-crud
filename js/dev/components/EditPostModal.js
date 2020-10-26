import { getCategories, updatePost } from "../utils.js"

import { AddCategoryModal } from "./AddCategoryModal.js"

export var EditPostModal = Vue.component('EditPostModal', {
	props: ['showCreateModal', 'originalPost'],
	data(){
		return {
			categories: [],
			post: '',
			msg: '',
			postCats: [],
			showCategoriesModal: false
		}
	},
	mounted(){
		this.post = this.originalPost.post
		this.postCats = this.originalPost.cats
		this.categories = getCategories()
	},
	methods: {
		editPost(){
			if(!this.post.trim()){
				this.msg = "Type something first"
				return
			}
			if(!this.postCats.length){
				this.msg = "Select at least one category"
				return
			}
			updatePost({
				post: this.post,
				cats: this.postCats,
				index: this.originalPost.index
			})
			this.$emit('edit')
			this.msg = ""
			this.post = ""
			this.postCats = []
			
		},
		refresh(){
			this.categories = getCategories()
			this.showCategoriesModal = false
		}
	},
	template: `
		<div class="modal" :class="{active: showCreateModal}">
			<div class="content">
				<h1>Edit post</h1>
				<button class="btn block" @click="showCategoriesModal = true">Add New Category</button>
				<textarea class="mx-2" placeholder="Start typing..." v-model="post"></textarea>
				<select class="mx-2" multiple v-model="postCats">
					<option selected disabled>
						Select Categories
					</option>
					<option v-for="(category, index) in categories" :key="index" :value="category">
						{{ category }}
					</option>
				</select>
				<p class="error-msg">{{ msg }}</p>
				<div class="footer text-right">
					<button class="btn mr-1 cancel" @click="$emit('close')">
						cancel
					</button>
					<button class="btn" @click="editPost()">
						update
					</button>
				</div>
				<AddCategoryModal :showCreateModal="showCategoriesModal" @close="showCategoriesModal = false" @added="refresh()"></AddCategoryModal>
			</div>
		</div>
	`
});