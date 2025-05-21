<script setup lang="ts">
const { signOut, data: user } = useAuth();

async function logout() {
  close();
  await signOut({ callbackUrl: "/login" });
}

function close() {
  document.activeElement.blur();
}
</script>

<template>
  <div v-if="user" class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img
          v-if="user"
          alt="Tailwind CSS Navbar component"
          :src="user.avatar"
        />
      </div>
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
      <li class="menu-title text-base-content">{{ user.username }}</li>
      <li @click="close">
        <NuxtLink to="/users">{{ $t("users") }}</NuxtLink>
      </li>
      <li v-if="user.role === 'admin'" @click="close">
        <NuxtLink class="justify-between" to="/settings">
          {{ $t("settings") }}
          <span class="badge badge-soft badge-warning">{{ user.role }}</span>
        </NuxtLink>
      </li>
      <li @click="logout">
        <div>{{ $t("logout") }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
