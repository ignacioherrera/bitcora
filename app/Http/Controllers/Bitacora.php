<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Operacion;

class Bitacora extends Controller
{

    public function index()
    {
        $operaciones = Operacion::all();

        return response()->json($operaciones); 
    }
    public function insertar(Request $request){
        
        $operation = new Operacion([
            'sl'=> $request['sl'],
            'tp'=> $request['tp'],
            'pip'=> $request['pip'],
            'entrada'=> $request['entrada'],
            'salida'=> $request['salida'],
            'lote'=> $request['lote'],
            'par'=> $request['par'],
            'descripcion'=> $request['descripcion'],
            'foto'=> $request['foto'], 
        ]);
        if($operation->save())return "saved";
    }
    public function foto(Request $request){
        $path = $request->file('file')->store('public');
        $nameArray = explode("/", $path);
        echo $nameArray[count($nameArray)-1];
    }
}
