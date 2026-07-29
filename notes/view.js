import { supabase } from './supabase.js';

// Ambil token dari URL (misal: view.html?token=abcde123)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

let noteData = null;

async function fetchNote() {
    if (!token) {
        showError("Token tidak ditemukan di URL.");
        return;
    }

    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('token', token)
        .single(); // Ambil 1 data saja

    if (error || !data) {
        showError("Catatan tidak ditemukan atau sudah dihapus.");
        return;
    }

    noteData = data;

    // Jika ada password, tampilkan form password
    if (noteData.password) {
        document.getElementById('passwordSection').classList.remove('hidden');
    } else {
        displayNote(); // Langsung tampilkan jika tidak ada password
    }
}

function displayNote() {
    document.getElementById('passwordSection').classList.add('hidden');
    document.getElementById('noteSection').classList.remove('hidden');
    
    document.getElementById('noteTitle').innerText = noteData.title;
    // Menggunakan textContent / split untuk menghindari XSS dan mempertahankan baris baru
    document.getElementById('noteContent').innerText = noteData.content; 
}

function showError(message) {
    document.getElementById('noteSection').classList.remove('hidden');
    document.getElementById('noteTitle').innerText = message;
    document.getElementById('noteContent').innerText = "";
}

// Cek password saat tombol diklik
document.getElementById('unlockBtn')?.addEventListener('click', () => {
    const inputPass = document.getElementById('viewPassword').value;
    if (inputPass === noteData.password) {
        displayNote();
    } else {
        document.getElementById('errorMsg').innerText = "Password salah!";
    }
});

// Jalankan saat halaman dimuat
fetchNote();