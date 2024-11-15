<template>
  <form>
    <v-text-field
      v-model="userForm.name"
      :error-messages="v$.name.$errors.map(e => e.$message='فیلد نام الزامی است.')"
      label="نام"
      required
      @blur="v$.name.$touch"
    />

    <v-text-field
      v-model="userForm.username"
      :error-messages="v$.username.$errors.map(e => e.$message= 'فیلد نام خانوادگی الزامی است.')"
      label="نام خانوادگی"
      required
      @blur="v$.username.$touch"
    />

    <v-text-field
      v-model="userForm.email"
      :error-messages="v$.email.$errors.map(e => e.$message ='فیلد ایمیل الزامی است.')"
      label="ایمیل"
      required
      @blur="v$.email.$touch"
    />

    <v-text-field
      v-model="userForm.phone"
      :error-messages="v$.phone.$errors.map(e => e.$message = 'فیلد شماره تماس الزامی است.')"
      label="شماره تماس"
      required
      @blur="v$.phone.$touch"
    />

    <div>
      <l-map
        :center="coords"
        style="height: 250px; width: 100%"
        :zoom="20"
      >
        <l-marker :lat-lng="coords" />
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </l-map>
    </div>
    <div class="d-flex justify-end mt-2">
      <v-btn
        class="me-4"
        @click="onSubmit"
      >
        افزودن کاربر
      </v-btn>
      <v-btn @click="clear">
        انصراف
      </v-btn>
    </div>
  </form>
</template>

<script setup lang="ts">
// Store
  import { useAppStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'
  // Utilities
  import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet'
  import '../styles/leaflet.css'
  // Types
  import type { Address } from '@/stores/types'

  // Define and init
  const store = useAppStore()
  const { userForm, v$, users } = storeToRefs(store)
  const props = defineProps({
    coords: { type: Array, default: () => [] },

  })
  const emit = defineEmits(['dialogAction'])
  // functions

  // clear user selection
  const clear = () => {
    emit('dialogAction', false)
    store.clear()
  }

  // submit form function
  const onSubmit = () => {
    nextTick(async () => {
      const isValid = await store.submitForm()
      console.log(isValid)

      if (isValid && userForm.value && userForm.value.name) {
        users.value.push({ ...userForm.value, id: users.value.length + 1, address: { geo: { lat: props.coords[0], lng: props.coords[1] } } })
        localStorage.setItem('allUsers', JSON.stringify(users.value))
        clear()
        store.clearSelectedUser()
        store.fetchUsers()
      } else if (isValid) {
        store.submitForm()
        console.error('something went wrong...')
      }
    })
  }
</script>
