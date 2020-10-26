import { getCategories, removeCategory } from "../utils.js"
import { AddCategoryModal } from "../components/AddCategoryModal.js"

export var Categories = Vue.component('categories', {
	data(){
		return {
			categories: [],
			showCreateModal: false
		}
	},
	mounted(){
		this.categories = getCategories()
	},
	methods: {
		refresh(){
			this.categories = getCategories()
			this.showCreateModal = false
		},
		remCat(cat){
			removeCategory(cat)
			this.categories = getCategories()
		}
	},
	template: `
	<div>
		<p class="text-right pb-3">
			<button class="btn" @click="showCreateModal = true">add category</button>
		</p>
		<div class="card inline mr-1 mx-1" v-for="(category, index) in categories" :key="index">
			{{ category }} <span class="delete ml-1" @click="remCat(category)">&times;</span>
		</div>
		<h2 class="light-text text-center" v-if="categories.length < 1">No Categories Yet.</h2>
		
		<AddCategoryModal :showCreateModal="showCreateModal" @close="showCreateModal = false" @added="refresh()"></AddCategoryModal>
		
	</div>
	`
});