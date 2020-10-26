import { addNewCategory } from "../utils.js"

export var AddCategoryModal = Vue.component('AddCategoryModal', {
	props: ['showCreateModal'],
	data(){
		return {
			category: '',
			msg: ''
		}
		
	},
	methods: {
		addCategory(){
			if(!this.category.trim()){
				this.msg = "Enter a category"
				return
			}
			addNewCategory(this.category.trim())
			this.msg = ""
			this.category = ""
			this.$emit('added')
		}
	},
	template: `
		<div class="modal" :class="{active: showCreateModal}">
			<div class="content">
				<h1>Add new category</h1>
				<input class="mx-2" type="text" placeholder="Enter new category" v-model="category">
				<p class="error-msg">{{ msg }}</p>
				<div class="footer text-right">
					<button class="btn mr-1 cancel" @click="$emit('close')">
						cancel
					</button>
					<button class="btn" @click="addCategory()">
						create
					</button>
				</div>
			</div>
		</div>
	`
});