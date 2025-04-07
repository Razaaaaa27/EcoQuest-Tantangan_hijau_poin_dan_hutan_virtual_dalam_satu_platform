<template>
  <div class="profile-page">
    <h1 class="title">Profil Pengguna</h1>
    <div class="profile-card">
      <img class="avatar" src="https://ui-avatars.com/api/?name=Raza+Warrior&background=random" alt="User Avatar" />
      <h2>Raza Warior</h2>
      <p>Level:  Legenda Hijau 🌱</p>
      <p>Total Poin: 3450</p>
      <p>Badge:  Gold 🥇</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile'
}
</script>

<style scoped>
.profile-page {
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2e7d32;
}

.profile-card {
  display: inline-block;
  background-color: #f0fdf4;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 128, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
}
</style>
