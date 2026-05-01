<?php

namespace App\Filament\Resources\Tukangs\Pages;

use App\Filament\Resources\Tukangs\TukangResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTukangs extends ListRecords
{
    protected static string $resource = TukangResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
