<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<h4 style="text-align: center; margin: 0; font-family: 'Inter', sans-serif; font-weight: bold;">Kantor Pelayanan Utama</h4>
<h4 style="text-align: center; margin: 0; font-family: 'Inter', sans-serif; font-weight: bold;">Bea dan Cukai Tipe B</h4>
<h4 style="text-align: center; margin: 0; font-family: 'Inter', sans-serif; font-weight: bold;">Batam</h4>
<div style="font-family: 'Inter', sans-serif; color: white; background-color: black; text-align: center; padding: 10px; margin: 20px; border-radius:10px"> {{ $layanan }} </div>
<h1 style="text-align: center; margin: 30px; font-family: 'Inter', sans-serif; font-size: 80px;"> {{ $nomor_antrian }} </h1>
<p style="text-align: right; font-family: 'Inter', sans-serif; ">{{ \Carbon\Carbon::parse($waktu_ambil)->format('d/m/Y -- H:i') }}</p>
