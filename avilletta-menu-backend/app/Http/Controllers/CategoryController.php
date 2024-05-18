<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            
            if ($search) {
                $categories = Category::where('name', 'like', '%' . $search . '%')->get();
            } else {
                $categories = Category::all();
            }
            
            if ($categories->isEmpty()) {
                return response()->json(['message' => 'Nessuna categoria disponibile'], 404);
            }
            
            return response()->json(['categories' => $categories]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }
    

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'name.required' => 'Inserisci un nome valido.',
                'image.image' => 'Il file caricato non è un\'immagine valida.',
                'image.mimes' => 'Il file caricato deve essere di uno dei seguenti formati: jpeg, png, jpg o gif.',
                'image.max' => 'La dimensione massima del file è 2048 KB.',
            ]);
    
            // Salva l'immagine su disco
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('images', $imageName, 'public');
            }
    
            // Crea la Categoria
            $categoryData = $request->except('image');
            $categoryData['image'] = $imagePath;
            $category = Category::create($categoryData);
    
            return response()->json(['message' => 'Categoria creata con successo', 'category' => $category], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = Category::findOrFail($id);
            return response()->json([
                'message' => 'Dettagli per ' . $category->name,
                'category' => $category
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Categoria non trovata'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);
            $request->validate([
                'name' => 'required|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'name.required' => 'Inserisci un nome valido.',
                'image.image' => 'Il file caricato non è un\'immagine valida.',
                'image.mimes' => 'Il file caricato deve essere di uno dei seguenti formati: jpeg, png, jpg o gif.',
                'image.max' => 'La dimensione massima del file è 2048 KB.',
            ]);
    
            // Aggiorna i campi della categoria tranne l'immagine
            $category->update($request->except('image'));
    
            // Se è stata caricata una nuova immagine, aggiorna il percorso dell'immagine
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('images', $imageName, 'public');
                $category->image = $imagePath;
                $category->save();
            }
    
            return response()->json(['message' => 'Categoria aggiornata con successo', 'category' => $category]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Categoria non trovata'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();
            return response()->json(['message' => 'Categoria '  . $category->name .  ' eliminata con successo'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Categoria ' . $category->name . ' non trovata'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }

    public function deleteImage($id)
    {
        try {
            $category = Category::findOrFail($id);
    
            // Verifica se l'immagine esiste
            if ($category->image) {
                // Elimina l'immagine dal disco
                if (Storage::disk('public')->exists($category->image)) {
                    Storage::disk('public')->delete($category->image);
                }
    
                // Aggiorna il percorso dell'immagine nel database a null
                $category->update(['image' => null]);
    
                return response()->json(['message' => 'Immagine della categoria eliminata con successo']);
            } else {
                return response()->json(['message' => 'La categoria non ha un\'immagine'], 404);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Categoria non trovata'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errore interno del server'], 500);
        }
    }

}