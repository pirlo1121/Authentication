import Producto from "../models/product.models.js";



export async function getProducts(req, res) {

    try {
        const products = await Producto.find();
        res.send(products)
    } catch (error) {
        console.log(error)
        res.send('error al obtener los productos')
        
    }
    
}

export async function create(req,res) {
    const { nombre, precio, descripcion } = req.body;

    try {
        if(!nombre) return res.send(' el nombre es requerido')
        if(!precio) return res.send(' el precio es requerido')

        const newProduct = new Producto(req.body);
        await newProduct.save()
        res.json({ok:true, newProduct})
        
    } catch (error) {
        console.log('error al crear el producto')
        res.send(error)
    }
    
}

export async function deleteProduct(req, res) {
    const { id } = req.params

    try {
        const findProduct = await Producto.findById({_id: id})
        if( !findProduct ) return res.send(' no hay productos con ese id');

        const productDelete = await Producto.findByIdAndDelete({_id: id});
        res.json({ok: true, productDelete})
        
    } catch (error) {
        console.log(' error al eliminar un producto');
        res.send(error)
        
    }
    
}

export async function updateProduct(req, res) {

    try {
        const data = req.body;
        const { id } = req.params

        const findProduct = await Producto.findById({_id: id})
        if( !findProduct ) return res.send('no existe ese producto')

        const updateProduct = await Producto.findByIdAndUpdate(id, data)
        const product = await Producto.findById({_id: id}) // revisar

    
        res.json({ok: true, product})
        
    } catch (error) {
        console.log(' Error al actualizar ');
        res.send(error);
        
    }
    
}

export async function getProductById(req, res) {

    try {
        const { id } = req.params
        const product = await Producto.findById({_id: id})
        if( !product ) return res.send(' no existe un producto con ese id ');

        res.json({ok: true, product})
        
    } catch (error) {
        console.log( 'Error al obtener un producto por ID')
        res.send(error)
        
    }
    
}