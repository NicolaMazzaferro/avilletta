<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

Route::apiResource('categories', CategoryController::class);
Route::delete('categories/{id}/delete-image', [CategoryController::class, 'deleteImage']);

Route::apiResource('products', ProductController::class);
Route::get('categories/{categoryName}/products', [ProductController::class, 'getProductsByCategory']);
Route::delete('products/{id}/delete-image', [ProductController::class, 'deleteImage']);


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
