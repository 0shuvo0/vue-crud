import { updateCategory } from "../utils.js"

export var EditCategoryModal = Vue.component('EditCategoryModal', {
	props: ['showCreateModal', 'cat'],
	data(){
		return {
			category: '',
			msg: ''
		}
		
	},
	mounted(){
		this.category = this.cat
	},
	watch: {
		cat(){
			this.category = this.cat
		}
	},
	methods: {
		editCategory(){
			if(!this.category.trim()){
				this.msg = "Enter a category"
				return
			}
			updateCategory(this.cat, this.category.trim())
			this.msg = ""
			this.category = ""
			this.$emit('edit')
		}
	},
	template: `
		<div class="modal" :class="{active: showCreateModal}">
			<div class="content">
				<h1>Edit category</h1>
				<input class="mx-2" type="text" placeholder="Enter new category" v-model="category">
				<p class="error-msg">{{ msg }}</p>
				<div class="footer text-right">
					<button class="btn mr-1 cancel" @click="$emit('close')">
						cancel
					</button>
					<button class="btn" @click="editCategory()">
						create
					</button>
				</div>
			</div>
		</div>
	`
});