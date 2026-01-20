<script setup lang="ts">
const props = defineProps({
  setup: {
    type: Boolean,
    required: false,
    default: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
});

const settings = reactive(props.modelValue);
const { signIn, data } = useAuth();

const step = ref(0);
const user = ref("");
const password = ref("");

if (!props.setup) {
  await nextTick();
  step.value = 1;
}

async function nextStep() {
  await $fetch("/api/settings/mediaServer", {
    method: "POST",
    body: {
      type: "jellyfin",
    },
  });
  step.value++;
}

async function login() {
  await signIn(
    { Username: user.value, Pw: password.value },
    { callbackUrl: "/" },
  );
  console.log(data.value);
}
</script>

<template>
  <div>
    <ul v-if="props.setup" class="steps pt-2 w-full">
      <li :class="`step ${step >= 0 ? 'step-primary' : ''}`">Server config</li>
      <li :class="`step ${step > 0 ? 'step-primary' : ''}`">Login</li>
    </ul>
    <ServarrSettingsForm
      v-if="settings && step === 0"
      v-model="settings.mediaServer"
      servarr="mediaServer"
      hide-title
      hide-previous-button
      ping-url="System/Ping"
      @next="nextStep"
    />
    <div v-if="step === 1">
      <fieldset class="fieldset my-4">
        <label class="label">{{ $t("user") }}</label>
        <input v-model="user" type="text" class="input w-full" placeholder="" />

        <label class="label">{{ $t("password") }}</label>
        <input
          v-model="password"
          type="password"
          class="input w-full"
          placeholder=""
        />
      </fieldset>
      <button class="btn btn-block btn-info" @click="login">
        {{ $t("login") }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
