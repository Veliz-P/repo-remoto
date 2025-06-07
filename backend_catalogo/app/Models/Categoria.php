<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $fillable =[
        'nombre',
        'slug',
    ];

    public function productos(){ //Relación muchos a muchos con Producto
        return $this->belongsToMany(Producto::class, 'categoria_producto');
    }
}
