<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    public function index() //Listar todos los productos
    {
        return Producto::with('categorias')->get(); //Obtener productos y categorias
    }

    public function create()
    {
        
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock'=> 'required|integer|min:0',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id', //validar que las categorias existan
        ]);

        $producto  = DB::Transaction(function () use ($validatedData, $request) {
            $producto = Producto::create($validatedData);
            if ($request->has('categorias')) {
                $producto->categorias()->sync($request->categorias);
            }
            return $producto; //201
        });
        return response()->json($producto,201);
    }

    public function show($id) //Mostrar producto por id
    {
        $producto = Producto::with('categorias')->findOrFail($id);
        return response()->json($producto);
    }

    public function edit(Producto $producto)
    {
        
    }

    public function update(Request $request, Producto $producto)
    {
        $validatedData = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'imagen' => 'nullable|string',
            'categorias' => 'nullable|array',
        ]);
        $producto->update($validatedData);
        if ($request->has('categorias')) {
            $producto->categorias()->sync($request->categorias);
        }
        return response()->json($producto,200);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();
        return response()->json(['message' => 'Producto eliminado correctamente'],204);
    }
}
