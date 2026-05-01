<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Auth\CustomLogin;
use App\Filament\Pages\Dashboard;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\HtmlString;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(CustomLogin::class)
            ->brandName('GoKang Clone')
            ->colors([
                'primary' => [
                    50 => '#FEF2F2',
                    100 => '#FEE2E2',
                    200 => '#FECACA',
                    300 => '#FCA5A5',
                    400 => '#F87171',
                    500 => '#E8272A',
                    600 => '#B81E21',
                    700 => '#991B1E',
                    800 => '#7F1D1D',
                    900 => '#641010',
                    950 => '#3F0000',
                ],
                'gray' => Color::Neutral,
                'danger' => Color::Red,
                'info' => Color::Blue,
                'success' => Color::Emerald,
                'warning' => Color::Amber,
            ])
            ->font('Inter')
            ->darkMode(true)
            ->sidebarCollapsibleOnDesktop()
            ->navigationGroups([
                'Transaksi',
                'Pengguna',
                'Master Data',
                'Marketing',
                'Pengaturan',
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                PanelsRenderHook::BODY_START,
                fn (): HtmlString => request()->is('admin/login')
                    ? new HtmlString('<style>
                        /* Force background merah & transparent containers */
                        body,
                        .dark body,
                        .fi-simple-layout,
                        .dark .fi-simple-layout {
                            background-color: #C8181A !important;
                        }
                        .fi-simple-main,
                        .dark .fi-simple-main,
                        .fi-simple-main-ctn,
                        .dark .fi-simple-main-ctn {
                            background: transparent !important;
                            box-shadow: none !important;
                        }

                        /* Hide Filament default brand/heading di simple page (kita pakai logo sendiri) */
                        .fi-simple-header { display: none !important; }

                        /* Form labels hitam supaya keliatan di card putih */
                        .fi-fo-field-label,
                        .fi-fo-field-label *,
                        .fi-fo-field-label-content,
                        .dark .fi-fo-field-label,
                        .dark .fi-fo-field-label *,
                        .dark .fi-fo-field-label-content {
                            color: #000000 !important;
                            font-weight: 600 !important;
                        }

                        /* Input field: background putih, border merah GoKang, text gelap */
                        .fi-input-wrp,
                        .dark .fi-input-wrp {
                            background: #FFFFFF !important;
                            border-color: #E8272A !important;
                            box-shadow: 0 0 0 1px #E8272A !important;
                        }
                        .fi-input-wrp:focus-within,
                        .dark .fi-input-wrp:focus-within {
                            border-color: #E8272A !important;
                            box-shadow: 0 0 0 3px rgba(232,39,42,0.18) !important;
                        }
                        .fi-input,
                        .dark .fi-input {
                            color: #111827 !important;
                            background: transparent !important;
                        }
                        .fi-input::placeholder,
                        .dark .fi-input::placeholder {
                            color: #9CA3AF !important;
                        }

                        /* Checkbox "Remember me" — border + accent merah GoKang */
                        .fi-checkbox-input,
                        .dark .fi-checkbox-input {
                            accent-color: #E8272A !important;
                            border-color: #E8272A !important;
                            box-shadow: 0 0 0 1px #E8272A !important;
                        }
                        .fi-checkbox-input:focus,
                        .fi-checkbox-input:focus-visible,
                        .dark .fi-checkbox-input:focus,
                        .dark .fi-checkbox-input:focus-visible {
                            box-shadow: 0 0 0 3px rgba(232,39,42,0.18) !important;
                            outline: none !important;
                        }

                        /* Hint / helper text */
                        .fi-fo-field-wrp-hint,
                        .dark .fi-fo-field-wrp-hint {
                            color: #6B7280 !important;
                        }

                        /* Validation error message */
                        .fi-fo-field-wrp-error-message,
                        .dark .fi-fo-field-wrp-error-message {
                            color: #DC2626 !important;
                        }
                    </style>')
                    : new HtmlString(''),
            );
    }
}
