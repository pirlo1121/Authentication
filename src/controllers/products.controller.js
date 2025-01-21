import Producto from "../models/product.models.js";

export async function getProducts(req, res) {
    try {
        const products = await Producto.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los productos');
    }
}

export async function create(req, res) {
    const { nombre, precio, descripcion } = req.body;

    try {
        if (!nombre) return res.status(400).send('El nombre es requerido');
        if (!precio) return res.status(400).send('El precio es requerido');

        const newProduct = new Producto(req.body);
        await newProduct.save();
        res.status(201).json({ ok: true, newProduct });
    } catch (error) {
        console.log('Error al crear el producto');
        res.status(500).send('Error interno al crear el producto');
    }
}

export async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        const findProduct = await Producto.findById({ _id: id });
        if (!findProduct) return res.status(404).send('No hay productos con ese ID');

        const productDelete = await Producto.findByIdAndDelete({ _id: id });
        res.status(200).json({ ok: true, productDelete });
    } catch (error) {
        console.log('Error al eliminar un producto');
        res.status(500).send('Error interno al eliminar el producto');
    }
}

export async function updateProduct(req, res) {
    try {
        const data = req.body;
        const { id } = req.params;

        const findProduct = await Producto.findById({ _id: id });
        if (!findProduct) return res.status(404).send('No existe ese producto');

        await Producto.findByIdAndUpdate(id, data);
        const product = await Producto.findById({ _id: id });

        res.status(200).json({ ok: true, product });
    } catch (error) {
        console.log('Error al actualizar');
        res.status(500).send('Error interno al actualizar el producto');
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Producto.findById({ _id: id });
        if (!product) return res.status(404).send('No existe un producto con ese ID');

        res.status(200).json({ ok: true, product });
    } catch (error) {
        console.log('Error al obtener un producto por ID');
        res.status(500).send('Error interno al obtener el producto por ID');
    }
}
