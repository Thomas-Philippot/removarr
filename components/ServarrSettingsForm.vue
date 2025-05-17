<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";

const props = defineProps({
  servarr: {
    type: String,
    required: true,
  },
});

const { data: settings } = useFetch(`/api/settings/${props.servarr}`);

function openModal() {
  const modal = document.getElementById(`${props.servarr}_modal`);
  modal.showModal();
}

async function postData() {
  await $fetch(`/api/settings/${props.servarr}`, {
    method: "POST",
    body: settings.value,
  });
  const modal = document.getElementById(`${props.servarr}_modal`);
  modal.close();
}

function showToast(type, message) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
}

async function ping() {
  const { error } = await useFetch(`/${props.servarr}/ping`);
  if (error.value) {
    showToast("alert alert-error", "Erreur de connexion");
  }
  showToast("alert alert-success", "Connexion au serveur reussi");
}
</script>

<template>
  <div v-if="settings">
    <div class="flex gap-4 my-4">
      <div class="card bg-base-200 w-96 ring-1">
        <div class="card-body">
          <h2 class="card-title">{{ props.servarr }}</h2>
          <p class="text-sm">
            <span class="mr-2 font-bold">Adresse</span>
            {{ settings.hostname }}
          </p>
          <p class="text-sm">
            <span class="mr-2 font-bold">Port</span>
            {{ settings.port }}
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-soft btn-accent" @click="openModal">
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
    <dialog :id="`${props.servarr}_modal`" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          Modifier le serveur {{ props.servarr }}
        </h3>
        <fieldset class="fieldset mt-6">
          <legend class="label">Hostname</legend>
          <input
            v-model="settings.hostname"
            type="text"
            class="input w-full"
            :placeholder="`http://${props.servarr}.mydomain.com`"
          />

          <label class="label">Port</label>
          <input
            v-model="settings.port"
            type="text"
            class="input w-full"
            placeholder="7878"
          />

          <label class="label">API KEY</label>
          <input
            v-model="settings.apiKey"
            type="text"
            class="input w-full"
            placeholder=""
          />
        </fieldset>
        <div class="modal-action flex justify-between">
          <button class="btn btn-outline btn-warning" @click="ping">
            Tester
          </button>
          <div class="flex gap-2">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-soft btn-accent">Fermer</button>
            </form>
            <button class="btn btn-primary" @click="postData">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
