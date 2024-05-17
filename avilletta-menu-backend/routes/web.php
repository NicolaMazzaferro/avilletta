<?php

use Illuminate\Support\Facades\Route;

Route::get('/avilletta', function () {
    return response()->json('A Villetta Menu');
});
