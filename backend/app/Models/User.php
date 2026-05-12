<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'role', 'department_id'];

    protected $hidden = ['password', 'remember_token'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isDeptHead(): bool
    {
        return $this->role === 'dept_head';
    }
}