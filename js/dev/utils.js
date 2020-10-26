var localStorageKey = "vcrud_"



//Category Utils
export var getCategories = function(){
	let d = localStorage.getItem(localStorageKey + "categories")
	if(!d) return []
	return JSON.parse(d)
}

export var addNewCategory = function(cat){
	var prev = getCategories()
	if(prev.indexOf(cat) > -1) return
	localStorage.setItem(localStorageKey + "categories", JSON.stringify([...prev, cat]))
}

export var removeCategory = function(cat){
	var cats = getCategories().filter(function(c){
		return c != cat
	})
	localStorage.setItem(localStorageKey + "categories", JSON.stringify(cats))
}




//Post Utils
export var getPosts = function(){
	let d = localStorage.getItem(localStorageKey + "posts")
	if(!d) return []
	return JSON.parse(d)
}

export var addNewPost = function(post, cats){
	var data = getPosts()
	let index = data.length
	data.unshift({
		post: post,
		cats: cats,
		index: index
	})
	localStorage.setItem(localStorageKey + "posts", JSON.stringify(data))
}

export var updatePost = function(newPost){
	var data = getPosts().map(function(p){
		if(p.index != newPost.index) return p
		p.post = newPost.post
		p.cats = newPost.cats
		return p
	})
	localStorage.setItem(localStorageKey + "posts", JSON.stringify(data))
}

export var removePost = function(post){
	var posts = getPosts().filter(function(p){
		return p.index != post.index
	})
	localStorage.setItem(localStorageKey + "posts", JSON.stringify(posts))
}