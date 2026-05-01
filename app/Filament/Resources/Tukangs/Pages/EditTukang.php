<?php

namespace App\Filament\Resources\Tukangs\Pages;

use App\Filament\Resources\Tukangs\TukangResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTukang extends EditRecord
{
    protected static string $resource = TukangResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
