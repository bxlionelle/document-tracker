<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'          => 'System Admin',
            'email'         => 'admin@doctracker.com',
            'password'      => Hash::make('password'),
            'role'          => 'admin',
            'department_id' => null,
        ]);

        // Department heads (one per dept)
        $heads = [
            ['name' => 'HR Head',  'email' => 'hr@doctracker.com',  'dept' => 1],
            ['name' => 'FIN Head', 'email' => 'fin@doctracker.com', 'dept' => 2],
            ['name' => 'IT Head',  'email' => 'it@doctracker.com',  'dept' => 3],
            ['name' => 'OPS Head', 'email' => 'ops@doctracker.com', 'dept' => 4],
            ['name' => 'LEG Head', 'email' => 'legal@doctracker.com','dept' => 5],
        ];

        foreach ($heads as $h) {
            User::create([
                'name'          => $h['name'],
                'email'         => $h['email'],
                'password'      => Hash::make('password'),
                'role'          => 'dept_head',
                'department_id' => $h['dept'],
            ]);
        }

        // Staff
        User::create([
            'name'          => 'John Staff',
            'email'         => 'staff@doctracker.com',
            'password'      => Hash::make('password'),
            'role'          => 'staff',
            'department_id' => 1,
        ]);
    }
}