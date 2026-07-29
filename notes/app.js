import { supabase } from './supabase.js';

// Fungsi membuat token unik (8 karakter)
function generateToken() {
    return Math.random().toString(36).substring(2, 10);
}

document.getElementById('saveBtn').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const password = document.getElementById('password').value || null;

    if (!title || !content) {
        alert('Judul dan isi catatan tidak boleh kosong!');
        return;
    }

    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    const token = generateToken();

    // Insert ke Supabase
    const { error } = await supabase
        .from('notes')
        .insert([{ token, title, content, password }]);

    btn.disabled = false;
    btn.innerText = 'Simpan & Dapatkan Link';

    if (error) {
        console.error(error);
        alert('Gagal menyimpan catatan: ' + error.message);
    } else {
        // Tampilkan link
        const shareUrl = `${window.location.origin}/view.html?token=${token}`;
        document.getElementById('resultBox').classList.remove('hidden');
        document.getElementById('shareLink').value = shareUrl;
        
        // Bersihkan form
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        document.getElementById('password').value = '';
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    document.execCommand('copy');
    alert('Link berhasil disalin!');
});