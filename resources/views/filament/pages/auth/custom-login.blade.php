<div>
    {{-- Logo Section --}}
    <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 32px;
    ">
        {{-- Logo --}}
        <div style="
            width: 96px;
            height: 96px;
            background: white;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        ">
            <div style="
                width: 72px;
                height: 72px;
                background: #C8181A;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <span style="
                    font-size: 44px;
                    font-weight: 900;
                    color: white;
                    line-height: 1;
                    font-family: Arial Black, sans-serif;
                ">K</span>
            </div>
        </div>

        <div style="
            font-size: 26px;
            font-weight: 800;
            color: white;
            letter-spacing: 3px;
        ">GOKANG</div>

        <div style="
            font-size: 12px;
            color: rgba(255,255,255,0.7);
            margin-top: 4px;
            letter-spacing: 2px;
        ">ADMIN PANEL</div>
    </div>

    {{-- Login Card --}}
    <div style="
        background: white;
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        max-width: 440px;
        margin: 0 auto;
    ">
        <h1 style="
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        ">Selamat Datang 👋</h1>

        <p style="
            font-size: 14px;
            color: #9CA3AF;
            margin-bottom: 28px;
        ">Masuk ke dashboard admin GoKang</p>

        {{-- Filament Form --}}
        <form wire:submit="authenticate">
            {{ $this->form }}

            <x-filament::button
                type="submit"
                size="lg"
                style="
                    width: 100%;
                    margin-top: 24px;
                    background: #E8272A;
                    border-radius: 28px;
                "
            >
                Masuk ke Dashboard
            </x-filament::button>
        </form>

        {{-- Footer Card --}}
        <p style="
            text-align: center;
            font-size: 12px;
            color: #D1D5DB;
            margin-top: 20px;
        ">
            © {{ date('Y') }} GoKang. All rights reserved.
        </p>
    </div>
</div>
