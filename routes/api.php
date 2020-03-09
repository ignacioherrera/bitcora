<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/operaciones',  'Bitacora@index');
Route::post('/operaciones',  'Bitacora@insertar');
Route::get('/operaciones/{id}',  'Bitacora@get');
Route::post('/operaciones/{id}',  'Bitacora@editar');
Route::delete('/operaciones/{id}',  'Bitacora@delete');
Route::post('/foto',  'Bitacora@foto');