import { Navbar } from "./components/Navbar.js";


import { Homepage } from "./pages/Homepage.js";
import { Categories } from "./pages/Categories.js"

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