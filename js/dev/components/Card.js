import { removePost } from "../utils.js"

import { EditPostModal } from "./EditPostModal.js"

export var Card = Vue.component('card', {
	props: ['post'],
	data(){
		return {
			showDelModal: false
		}
	},
	methods: {
		delPost(){
			removePost(this.post)
			this.$emit('change')
		},
		remove(){
			this.showDelModal = false
			this.$emit('change')
		}
	},
	template: `
		<div class="card mx-2">
			{{ post.post }}
			<p class ="categories">
				<span>{{ post.cats.join(", ") }}</span>
				<span>
					<span class="mr-1 edit" @click="showDelModal = true">edit <i class="fas fa-pencil-alt"></i></span>
					<span class="delete" @click="delPost()">delete <i class="fas fa-trash"></i></span>
				</span>
			</p>
			<EditPostModal :showCreateModal="showDelModal" @close="showDelModal = false" :originalPost="post" @edit="remove()"></EditPostModal>
		</div>
	`
});