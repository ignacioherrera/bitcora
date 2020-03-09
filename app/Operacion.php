<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Operacion extends Model
{
   protected $table = 'operacion';

   protected $fillable = ['sl', 'tp', 'lote', 'pip', 'entrada', 'salida', 'descripcion', 'par', 'foto'];
}
