var Navbar = Vue.component('nav-bar', {
	data: function(){
		return {
			showNavbar: false,
			links: [
				{
					title: "Posts",
					path: "/",
					icon: "fa-list"
				},
				{
					title: "Categories",
					path: "/categories",
					icon: "fa-star"
				}
			]
		}
	},
	template: `
<div>
	<header class="navbar container">
		<router-link to="/" class="brand">Vue<span>CRUD</span></router-link>
		<nav class="nav">
			<router-link class="nav-link" v-for="(link, key) in links" :key="key" :to="link.path" :class="{ active: link.path === $route.path }">{{ link.title }}</router-link>
		</nav>
		<div class="toggle-btn" :class="{active: showNavbar}" @click="showNavbar = true">
			<div class="bar a"></div>
			<div class="bar b"></div>
			<div class="bar c"></div>
		</div>
	</header>
	
	<div class="side-menu-wrapper" :class="{active: showNavbar}" @click="showNavbar = false">
		<div class="side-menu">
			<router-link class="menu-item" v-for="(link, key) in links" :key="key" :to="link.path" :class="{ active: link.path === $route.path }">
				<i class="fas" :class="link.icon"></i> {{ link.title }}
			</router-link>
		</div>
	</div>
</div>
	`
});

var localStorageKey = "vcrud_";



//Category Utils
var getCategories = function(){
	let d = localStorage.getItem(localStorageKey + "categories");
	if(!d) return []
	return JSON.parse(d)
};

var addNewCategory = function(cat){
	var prev = getCategories();
	if(prev.indexOf(cat) > -1) return
	localStorage.setItem(localStorageKey + "categories", JSON.stringify([...prev, cat]));
};

var removeCategory = function(cat){
	var cats = getCategories().filter(function(c){
		return c != cat
	});
	localStorage.setItem(localStorageKey + "categories", JSON.stringify(cats));
};




//Post Utils
var getPosts = function(){
	let d = localStorage.getItem(localStorageKey + "posts");
	if(!d) return []
	return JSON.parse(d)
};

var addNewPost = function(post, cats){
	var data = getPosts();
	let index = data.length;
	data.unshift({
		post: post,
		cats: cats,
		index: index
	});
	localStorage.setItem(localStorageKey + "posts", JSON.stringify(data));
};

var updatePost = function(newPost){
	var data = getPosts().map(function(p){
		if(p.index != newPost.index) return p
		p.post = newPost.post;
		p.cats = newPost.cats;
		return p
	});
	localStorage.setItem(localStorageKey + "posts", JSON.stringify(data));
};

var removePost = function(post){
	var posts = getPosts().filter(function(p){
		return p.index != post.index
	});
	localStorage.setItem(localStorageKey + "posts", JSON.stringify(posts));
};

var AddCategoryModal = Vue.component('AddCategoryModal', {
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
				this.msg = "Enter a category";
				return
			}
			addNewCategory(this.category.trim());
			this.msg = "";
			this.category = "";
			this.$emit('added');
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

var EditPostModal = Vue.component('EditPostModal', {
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
		this.post = this.originalPost.post;
		this.postCats = this.originalPost.cats;
		this.categories = getCategories();
	},
	methods: {
		editPost(){
			if(!this.post.trim()){
				this.msg = "Type something first";
				return
			}
			if(!this.postCats.length){
				this.msg = "Select at least one category";
				return
			}
			updatePost({
				post: this.post,
				cats: this.postCats,
				index: this.originalPost.index
			});
			this.$emit('edit');
			this.msg = "";
			this.post = "";
			this.postCats = [];
			
		},
		refresh(){
			this.categories = getCategories();
			this.showCategoriesModal = false;
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

var Card = Vue.component('card', {
	props: ['post'],
	data(){
		return {
			showDelModal: false
		}
	},
	methods: {
		delPost(){
			removePost(this.post);
			this.$emit('change');
		},
		remove(){
			this.showDelModal = false;
			this.$emit('change');
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

var AddPostModal = Vue.component('AddPostModal', {
	props: ['showCreateModal'],
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
		this.categories = getCategories();
	},
	methods: {
		addNewPost(){
			if(!this.post.trim()){
				this.msg = "Type something first";
				return
			}
			if(!this.postCats.length){
				this.msg = "Select at least one category";
				return
			}
			addNewPost(this.post, this.postCats);
			this.msg = "";
			this.post = "";
			this.postCats = [];
			this.$emit('added');
		},
		refresh(){
			this.categories = getCategories();
			this.showCategoriesModal = false;
		}
	},
	template: `
		<div class="modal" :class="{active: showCreateModal}">
			<div class="content">
				<h1>Create a new post</h1>
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
					<button class="btn" @click="addNewPost()">
						publish
					</button>
				</div>
				<AddCategoryModal :showCreateModal="showCategoriesModal" @close="showCategoriesModal = false" @added="refresh()"></AddCategoryModal>
			</div>
		</div>
	`
});

var Homepage = Vue.component('home-page', {
	data(){
		return {
			showCreateModal: false,
			posts: []
		}
	},
	mounted(){
		this.posts = getPosts();
	},
	methods: {
		refresh(){
			this.posts = getPosts();
			this.showCreateModal = false;
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

var Categories = Vue.component('categories', {
	data(){
		return {
			categories: [],
			showCreateModal: false
		}
	},
	mounted(){
		this.categories = getCategories();
	},
	methods: {
		refresh(){
			this.categories = getCategories();
			this.showCreateModal = false;
		},
		remCat(cat){
			removeCategory(cat);
			this.categories = getCategories();
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

var routes = [
	{ path: '/', component: Homepage, name: 'homepage' },
	{ path: '/categories', component: Categories, name: 'categoriespage' }
];

var router = new VueRouter({
	routes: routes,
});

var app = new Vue({
	router: router,
	el: "#app"
});
