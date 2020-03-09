<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOperacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operacion', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->double('entrada');
            $table->double('tp')->nullable();
            $table->double('lote');
            $table->double('sl')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('foto')->nullable();
            $table->string('par');
            $table->double('pip');
            $table->double('salida');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('operacion');
    }
}
