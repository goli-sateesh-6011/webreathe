<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modules_data', function (Blueprint $table) {
            $table->id();
            $table->timestamp('timestamp', 6);
            $table->string('sensor_name');
            $table->integer('sensor_value');
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('sensor_id');
            
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('sensor_id')->references('id')->on('sensors')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('sensor_name')->references('name')->on('sensors')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modules_data');
    }
}
