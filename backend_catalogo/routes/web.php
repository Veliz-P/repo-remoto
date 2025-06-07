<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

//Asocia la url y método HTTP (GET, POST, PUT Y DELETE) con el controlador
//Route::resource('productos', ProductoController::class);
