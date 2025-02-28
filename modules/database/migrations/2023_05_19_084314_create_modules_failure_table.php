<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesFailureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modules_failure', function (Blueprint $table) {
            $table->id();
            $table->timestamp('failure_timestamp');
            $table->unsignedBigInteger('module_id');
            
            $table->foreign('module_id', 'modules_failure_module_id_to_modules_id')->references('id')->on('modules');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modules_failure');
    }
}
