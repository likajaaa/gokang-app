<?php

namespace App\Filament\Resources\AdminUsers\Pages;

use App\Filament\Resources\AdminUsers\AdminUserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateAdminUser extends CreateRecord
{
    protected static string $resource = AdminUserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Ensure admin accounts are active and phone-verified by default
        $data['status'] = $data['status'] ?? 'active';
        $data['phone_verified_at'] = $data['phone_verified_at'] ?? now();
        $data['email_verified_at'] = $data['email_verified_at'] ?? now();

        return $data;
    }
}
