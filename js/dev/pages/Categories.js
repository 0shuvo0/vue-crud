import { getCategories, removeCategory } from "../utils.js"
import { AddCategoryModal } from "../components/AddCategoryModal.js"
import { EditCategoryModal } from "../components/EditCategoryModal.js"

export var Categories = Vue.component('categories', {
	data(){
		return {
			categories: [],
			showCreateModal: false,
			showEditModal: false,
			catToEdit: ""
		}
	},
	mounted(){
		this.categories = getCategories()
	},
	methods: {
		refresh(){
			this.categories = getCategories()
			this.showCreateModal = false
			this.showEditModal = false
		},
		remCat(cat){
			removeCategory(cat)
			this.categories = getCategories()
		},
		initEdit(cat){
			this.catToEdit = cat
			this.showEditModal = true
		}
	},
	template: `
	<div>
		<p class="text-right pb-3">
			<button class="btn" @click="showCreateModal = true">add category</button>
		</p>
		<div class="card inline mr-1 mx-1" v-for="(category, index) in categories" :key="index">
			{{ category }} <span class="edit ml-1 fas fa-pencil-alt" @click="initEdit(category)"></span><span class="delete ml-1 fas fa-trash" @click="remCat(category)"></span>
		</div>
		<h2 class="light-text text-center" v-if="categories.length < 1">No Categories Yet.</h2>
		
		<AddCategoryModal :showCreateModal="showCreateModal" @close="showCreateModal = false" @added="refresh()"></AddCategoryModal>
		<EditCategoryModal :showCreateModal="showEditModal" @close="showEditModal = false" :cat="catToEdit" @edit="refresh()"></EditCategoryModal>
	</div>
	`
});