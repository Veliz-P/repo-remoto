<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoProducto extends Model
{
    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];
    public function pedidos(){
        return $this->belongsTo(Pedido::class);
    }
    public function productos(){
        return $this->belongsTo(Producto::class);
    }
}
