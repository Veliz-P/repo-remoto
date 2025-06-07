<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrito extends Model
{
    protected $fillable =[
        'user_id',
        'estado'
    ];

    public function carritoProductos(){
        return $this->hasMany(CarritoProducto::class, 'carrito_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
