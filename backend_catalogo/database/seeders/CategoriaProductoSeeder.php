<?php
 
namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Producto;
 
class CategoriaProductoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear categorías usando firstOrCreate
        $categorias = [
            ['nombre' => 'Electrónica', 'slug' => 'electronica'],
            ['nombre' => 'Ropa', 'slug' => 'ropa'],
            ['nombre' => 'Hogar', 'slug' => 'hogar'],
            ['nombre' => 'Deportes', 'slug' => 'deportes'],
            ['nombre' => 'Libros', 'slug' => 'libros'],
            ['nombre' => 'Muebles', 'slug' => 'muebles'],
        ];
 
        foreach ($categorias as $catData) {
            Categoria::firstOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        $productos = [
            // Electrónica
            [
                'titulo' => 'Laptop X1',
                'descripcion' => 'Laptop de alto rendimiento con procesador i7 y 16GB RAM',
                'precio' => 1200.50,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/laptop.jpg?alt=media&token=e2bc61e1-d990-4b8d-95b2-eda7883af0bc',
                'stock' => 10,
            ],
            [
                'titulo' => 'Smartphone Pro',
                'descripcion' => 'Teléfono inteligente con cámara de 48MP y pantalla AMOLED',
                'precio' => 899.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/smartphone_pro.png?alt=media&token=0cb429a0-cd08-4dd4-8b7e-745fd9cb2113',
                'stock' => 15,
            ],
            [
                'titulo' => 'Auriculares Inalámbricos',
                'descripcion' => 'Auriculares con cancelación de ruido y 20h de batería',
                'precio' => 35.35,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/auriculares_inal%C3%A1mbricos.jpg?alt=media&token=948852de-e8f6-42d4-acb4-2daff15438e5',
                'stock' => 30,
            ],
            
            // Ropa
            [
                'titulo' => 'Camisa Casual',
                'descripcion' => 'Camisa de algodón 100% para hombre',
                'precio' => 25.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/camisa_casual.jpg?alt=media&token=73eb8e0b-7a3a-48f6-86e0-043d745a4582',
                'stock' => 50,
            ],
            [
                'titulo' => 'Jeans Slim Fit',
                'descripcion' => 'Pantalones jeans ajustados para mujer',
                'precio' => 45.50,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/jeans_slim_fit.jpg?alt=media&token=1cdc272a-325f-4f23-860f-e24e04d45dd8',
                'stock' => 35,
            ],
            [
                'titulo' => 'Chaqueta de Invierno',
                'descripcion' => 'Chaqueta impermeable con capucha',
                'precio' => 89.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/chaqueta_invierno.jpg?alt=media&token=073d71f6-2385-4faa-b360-af904d7787dd',
                'stock' => 20,
            ],
            
            // Hogar
            [
                'titulo' => 'Sofá Moderno',
                'descripcion' => 'Sofá de diseño cómodo para sala de estar',
                'precio' => 499.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/sof%C3%A1_moderno.jpg?alt=media&token=349f1378-10d0-449d-aeed-cb4fdd1211d7',
                'stock' => 5,
            ],
            [
                'titulo' => 'Juego de Sábanas',
                'descripcion' => 'Juego de sábanas de algodón egipcio, tamaño queen',
                'precio' => 59.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/juego_de_sabanas.jpg?alt=media&token=430b7394-bdd5-40ab-8d06-5483d732a58f',
                'stock' => 25,
            ],
            [
                'titulo' => 'Set de Cocina',
                'descripcion' => 'Set de 12 piezas de utensilios de cocina antiadherentes',
                'precio' => 79.50,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/set_cocina.jpg?alt=media&token=9c6be140-272c-4540-9367-cc3bfca0f497',
                'stock' => 18,
            ],
            
            // Deportes
            [
                'titulo' => 'Balón de Fútbol',
                'descripcion' => 'Balón oficial tamaño 5 para partidos profesionales',
                'precio' => 29.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/bal%C3%B3n_f%C3%BAtbol.jpg?alt=media&token=ce83b792-d95d-4088-bc4d-097c62622fbf',
                'stock' => 40,
            ],
            [
                'titulo' => 'Mancuernas Ajustables',
                'descripcion' => 'Par de mancuernas ajustables de 5-25kg',
                'precio' => 129.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/mancuernas_ajustables.jpg?alt=media&token=36b469c1-b6d3-468d-a982-8804e1113f04',
                'stock' => 12,
            ],
            
            // Libros
            [
                'titulo' => 'Raffles Manos de Seda',
                'descripcion' => 'La última novela del autor fallecido más vendido',
                'precio' => 14.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/libro_raffles_manos_de_seda.jpg?alt=media&token=eb8eea11-9ca6-4bba-beb1-fbb586eb8b04',
                'stock' => 45,
            ],
            [
                'titulo' => 'Libro de Cocina',
                'descripcion' => 'Recetas gourmet para principiantes',
                'precio' => 24.50,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/libro_cocina.jpg?alt=media&token=96319766-fac2-4d56-8486-69f375a0a6d8',
                'stock' => 28,
            ],
            
            // Belleza
            [
                'titulo' => 'Kit de Maquillaje',
                'descripcion' => 'Set completo con 12 sombras, labiales y brochas',
                'precio' => 49.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/kit_maquillaje.jpg?alt=media&token=851acef8-dc74-4fa0-98d2-7090f9d0333a',
                'stock' => 25,
            ],
            
            // Alimentos
            [
                'titulo' => 'Café Premium',
                'descripcion' => 'Café en grano 100% arábica de origen único',
                'precio' => 12.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/caf%C3%A9_premium.jpg?alt=media&token=8cf2faa9-cdaf-4ded-b8cc-f315339c30cb',
                'stock' => 60,
            ],
            
            // Muebles
            [
                'titulo' => 'Mesa de Centro',
                'descripcion' => 'Mesa de centro moderna en madera de roble',
                'precio' => 199.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/catalogo-productos-imagenes.firebasestorage.app/o/mesa_centro.jpg?alt=media&token=c90d9223-1d48-4cd8-9351-be89f408857e',
                'stock' => 8,
            ],
            
            
        ];

        foreach ($productos as $prodData) {
            $producto = Producto::firstOrCreate(
                ['titulo' => $prodData['titulo']],
                $prodData
            );

            $categoriaIds = Categoria::inRandomOrder()->limit(rand(1, 2))->pluck('id')->toArray();
            $producto->categorias()->sync($categoriaIds);
        }
    }
}