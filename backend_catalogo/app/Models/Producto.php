<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable =[
        'titulo',
        'descripcion',
        'precio',
        'imagen',
        'stock',
    ];

    public function categorias(){ //Relación muchos a muchos con Categoria
        return $this->belongsToMany(Categoria::class, 'categoria_producto');
    }
    public function carritoProductos(){
        return $this->hasMany(CarritoProducto::class, 'producto_id');
    }
    public function pedidoProductos(){
        return $this->hasMany(PedidoProducto::class, 'producto_id');
    }
}
