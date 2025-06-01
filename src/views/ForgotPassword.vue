<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Lupa Password</h1>
      <p>Masukkan email Anda untuk mengatur ulang password.</p>
      <form @submit.prevent="handleSubmit">
        <input v-model="email" type="email" placeholder="Email" required />
        <button type="submit">Kirim Email Reset</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: ''
    };
  },
  methods: {
    handleSubmit() {
      alert(`Link reset telah dikirim ke ${this.email}`);
      // Logika backend (jika sudah tersedia) bisa ditambahkan di sini
    }
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 100px auto;
  text-align: center;
}
input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
}
button {
  padding: 8px 16px;
}
</style>
