<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('department')->get());
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'role'          => 'sometimes|in:admin,dept_head,staff',
            'department_id' => 'sometimes|nullable|exists:departments,id',
        ]);

        $user->update($data);
        return response()->json($user->load('department'));
    }
}