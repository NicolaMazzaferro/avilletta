<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\Paginator;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    // Mostra tutti i prodotti
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            $category = $request->query('category');

            $productsQuery = Product::with('category');

            if ($search) {
                $productsQuery->where('name', 'like', '%' . $search . '%');
            }

            if ($category) {
                $productsQuery->whereHas('category', function ($query) use ($category) {
                    $query->where('name', $category);
                });
            }

            $products = $productsQuery->paginate(10);

            if ($products->isEmpty()) {
                return response()->json(['message' => 'Nessun prodotto disponibile'], 404);
            }

            $products->withQueryString()->links();

            return response()->json(['products' => $products]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore nel caricamento dei dati' . $e], 500);
        }        
    }


    // Mostra un singolo prodotto
    public function show($id)
    {
        try {
            $product = Product::findOrFail($id);
            return response()->json([
                'message' => 'Dettagli per ' . $product->name,
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Prodotto non trovato'], 404);
        }
    }

    // Mostra i prodotti per categoria
    public function getProductsByCategory($categoryName)
    {
        $category = Category::where('name', $categoryName)->first();

        if (!$category) {
            return response()->json(['error' => 'Categoria ' . $categoryName . ' non trovata'], 404);
        }

        $products = $category->products;

        return response()->json([
            'message' => 'Prodotti nella categoria ' . $categoryName,
            'products' => $products
        ]);
    }
    
    public function store(Request $request)
    {
        try {
            $request->validate([
                'category_id' => 'required|exists:categories,id',
                'name' => 'required',
                'description' => 'nullable',
                'price' => 'required|numeric',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'category_id.required' => 'Il campo categoria è obbligatorio.',
                'category_id.exists' => 'La categoria selezionata non è valida.',
                'name.required' => 'Il campo nome è obbligatorio.',
                'price.required' => 'Il campo prezzo è obbligatorio.',
                'price.numeric' => 'Il campo prezzo deve essere un valore numerico.',
                'image.image' => 'Il file caricato non è un\'immagine valida.',
                'image.mimes' => 'Il file caricato deve essere di uno dei seguenti formati: jpeg, png, jpg o gif.',
                'image.max' => 'La dimensione massima del file è 2048 KB.',
            ]);
            

            // Salva l'immagine su disco
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $imagePath = 'images/' . $imageName;
            }

            // Crea il prodotto
            $productData = $request->except('image');
            $productData['image'] = $imagePath;
            $product = Product::create($productData);

            return response()->json([
                'message' => $product->name . ' caricato con successo',
                'product' => $product
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }

    // Aggiorna un prodotto esistente
    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            $request->validate([
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'image.image' => 'Il file caricato non è un\'immagine valida.',
                'image.mimes' => 'Il file caricato deve essere di uno dei seguenti formati: jpeg, png, jpg o gif.',
                'image.max' => 'La dimensione massima del file è 2048 KB.'
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $imagePath = 'images/' . $imageName;

                $product->image = $imagePath;
            }

            $product->update($request->except('image'));

            return response()->json([
                'message' => $product->name . ' modificato con successo',
                'product' => $product
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server: ' . $e->getMessage()], 500);
        }        
    }

    // Elimina solo l'immagine di un prodotto
    public function deleteImage($id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Verifica se il prodotto ha un'immagine
            if ($product->image) {
                // Rimuovi l'immagine dal disco
                if (file_exists(public_path($product->image))) {
                    unlink(public_path($product->image));
                }
                
                // Aggiorna il campo 'image' del prodotto a null
                $product->image = null;
                $product->save();
                
                return response()->json(['message' => 'Immagine del prodotto eliminata con successo'], 200);
            } else {
                return response()->json(['error' => 'Il prodotto non ha un\'immagine'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Prodotto non trovato'], 404);
        }
    }

    // Elimina un prodotto
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return response()->json(['message' => $product->name . ' eliminato con successo'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Prodotto non trovato'], 404);
        }
    }

    // Paginazione
    public function paginate()
    {
        try {
            $perPage = request()->has('per_page') ? (int) request()->per_page : 10;
            $products = Product::with('category')->paginate($perPage);


            if ($products->isEmpty()) {
                return response()->json(['message' => 'Nessun prodotto disponibile'], 404);
            }

            return response()->json(['products' => $products]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore nel caricamento dei dati'], 500);
        }
    }

}