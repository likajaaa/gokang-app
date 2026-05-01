<?php

namespace App\Filament\Resources\Tukangs;

use App\Filament\Resources\Tukangs\Pages\EditTukang;
use App\Filament\Resources\Tukangs\Pages\ListTukangs;
use App\Filament\Resources\Tukangs\Schemas\TukangForm;
use App\Filament\Resources\Tukangs\Schemas\TukangInfolist;
use App\Filament\Resources\Tukangs\Tables\TukangsTable;
use App\Models\Tukang;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class TukangResource extends Resource
{
    protected static ?string $model = Tukang::class;

    protected static BackedEnum|string|null $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?string $navigationLabel = 'Tukang';

    protected static string|\UnitEnum|null $navigationGroup = 'Pengguna';

    protected static ?int $navigationSort = 20;

    protected static ?string $recordTitleAttribute = 'user.name';

    public static function form(Schema $schema): Schema
    {
        return TukangForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return TukangInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TukangsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTukangs::route('/'),
            'edit' => EditTukang::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->with(['user', 'services']);
    }

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->isSuperAdmin() || $user->isAdmin() || $user->isCs());
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit($record): bool
    {
        return in_array(auth()->user()?->role, ['super_admin', 'admin'], true);
    }

    public static function canDelete($record): bool
    {
        return false;
    }
}
