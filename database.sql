-- Tabel untuk menampung data laporan dari user
CREATE TABLE public.laporan (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 1. Identitas
    nama TEXT NOT NULL,
    no_telepon TEXT NOT NULL,
    domisili TEXT NOT NULL,
    
    -- 2. Detail Gadget
    jenis_gadget TEXT NOT NULL, -- (HP, Laptop, Lainnya)
    merk_gadget TEXT NOT NULL,
    versi_gadget TEXT NOT NULL,
    
    -- 3. Detail Masalah
    kategori_keluhan TEXT NOT NULL,
    deskripsi_laporan TEXT NOT NULL,
    
    -- 4. Media
    foto_url TEXT, -- Opsional, akan diisi dengan URL foto dari Supabase Storage
    
    -- Tracking (Tambahan agar mudah memantau status)
    status TEXT DEFAULT 'pending', -- (pending, diproses, selesai)
    
    PRIMARY KEY (id)
);

-- Mengaktifkan Row Level Security (RLS) di Supabase
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;

-- Policy 1: Mengizinkan public / anon (siapapun yang mengisi form) untuk mengirim data (INSERT)
CREATE POLICY "Izinkan publik untuk menambah laporan" 
    ON public.laporan 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Policy 2: Hanya user yang login di sistem Supabase (Admin) yang bisa melihat isi tabel (SELECT)
CREATE POLICY "Admin bisa melihat laporan" 
    ON public.laporan 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- ==========================================
-- POLICY UNTUK STORAGE (BUCKET: laporan_foto)
-- ==========================================
-- Policy 3: Mengizinkan public/anon untuk MENGUPLOAD file ke bucket "laporan_foto"
CREATE POLICY "Izinkan publik upload foto"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'laporan_foto');
