const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const save = (dato) => fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'),JSON.stringify(dato,null,4),'utf-8')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		    res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let id = +req.params.id
		let productDetail = products.find((product) => product.id === id)
		let name = productDetail.name
		return res.render('detail',{
		product : productDetail,
		name,
		toThousand
	})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let newProduct = {
			id: products[products.length - 1].id + 1,
  			name: req.body.name,
			price : req.body.price,
			discount : req.body.discount,
			category : req.body.category,
			description : req.body.description
		}
		products.push(newProduct)
		save(products)

		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		let id = +req.params.id;
		let productEdit = products.find((product) => product.id === id)
		let name = productEdit.name;
		
		res.render('product-edit-form',{
			product : productEdit,
			name,
			toThousand
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let id = +req.params.id

		products.forEach((product) => {
			if(product.id === id){
				product.name = req.body.name,
				product.price = req.body.price,
				product.discount = req.body.discount,
				product.category = req.body.category,
				product.description = req.body.description
			}
			
		});
		save(products)
		/* res.redirect(`/detail/${id}`) */
		res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let id = req.params.id
		let newList = products.filter((product) => product.id !== id)
		save(newList)
		res.redirect('/products')
	}
};

module.exports = controller;